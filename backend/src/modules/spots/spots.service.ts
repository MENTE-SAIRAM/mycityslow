// ─────────────────────────────────────────────────────────────
// Spots: Service — discovery, trending, nearby, submit
// ─────────────────────────────────────────────────────────────
import mongoose from 'mongoose';
import { Spot } from '../../models/Spot';
import { City } from '../../models/City';
import { SpotSubmission } from '../../models/SpotSubmission';
import { createError } from '../../middleware/errorHandler';

interface DiscoveryQuery {
    city?: string;
    category?: string;
    vibe?: string;
    bestTime?: string;
    crowdLevel?: string;
    activity?: string;
    travelerType?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    search?: string;
    page?: number;
    limit?: number;
}

export const spotsService = {
    /**
     * Mobile spot detail UI text payload with all card data
     */
    getMobileSpotDetailUiText() {
        return {
            sectionBestTimeForSilence: 'Best Time for Silence',
            sectionHowToReach: 'How to Reach',
            sectionNearbySimilarSpots: 'Nearby Similar Spots',
            peaceScoreLabel: 'PEACE SCORE',
            peaceScoreSuffix: '/10',
            vibeLabelPrefix: 'Vibe:',
            bestTimeLabelPrefix: 'Best:',
            bestTimeInsightText: 'Morning hours offer 95% noise reduction compared to city average.',
            bestTimeChartLabels: ['12P', '4P', '8P', '6A', '8A', '10A'],
            bestTimeChartHeights: [24, 20, 14, 72, 58, 30],
            bestTimeChartHighlightIndex: 3,
            mapFallbackDistanceLabel: 'Map view',
            distanceAwayTemplate: '{value} km away',
            distanceChipTemplate: '{value} km',
            nearbyFallbackDistanceLabel: 'Nearby',
            noNearbySpotsText: 'No nearby spots available yet.',
            addToSlowListText: 'Add to My Slow List',
            addedToSlowListText: 'Added to My Slow List',
            startWalkingText: 'Start Walking',
        };
    },

    /**
     * Android mobile card data payload (all cards in one endpoint)
     * Platform-agnostic: for iOS and Android clients
     */
    getMobileCardData() {
        return {
            peaceScoreCard: {
                label: 'PEACE SCORE',
                suffix: '/10',
                icon: 'explore',
            },
            bestTimeCard: {
                title: 'Best Time for Silence',
                chartLabels: ['12P', '4P', '8P', '6A', '8A', '10A'],
                chartHeights: [24, 20, 14, 72, 58, 30],
                highlightIndex: 3,
                insightText: 'Morning hours offer 95% noise reduction compared to city average.',
                vibeLabelPrefix: 'Vibe:',
                bestTimeLabelPrefix: 'Best:',
            },
            mapCard: {
                title: 'How to Reach',
                fallbackLabel: 'Map view',
                distanceTemplate: '{value} km away',
            },
            nearbySpotsCard: {
                title: 'Nearby Similar Spots',
                distanceTemplate: '{value} km',
                emptyText: 'No nearby spots available yet.',
            },
            bottomBar: {
                addToListText: 'Add to My Slow List',
                addedToListText: 'Added to My Slow List',
                startWalkingText: 'Start Walking',
            },
        };
    },

    /**
     * Discovery feed — filtered spots with pagination
     */
    async discoverSpots(query: DiscoveryQuery) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;

        const filter: any = { isApproved: true };

        // City filter (by slug)
        if (query.city) {
            const city = await City.findOne({ slug: query.city });
            if (city) filter.city = city._id;
        }

        // Category filter
        if (query.category) {
            filter.categories = { $in: [query.category] };
        }

        // Vibe, bestTime, crowdLevel filters
        if (query.vibe) filter.vibe = query.vibe;
        if (query.bestTime) filter.bestTime = query.bestTime;
        if (query.crowdLevel) filter.crowdLevel = query.crowdLevel;

        // Activity filter
        if (query.activity) {
            filter.activities = { $in: [query.activity] };
        }

        if (query.travelerType) {
            filter.travelerTypes = { $in: [query.travelerType] };
        }

        // Text search
        if (query.search) {
            filter.$text = { $search: query.search };
        }

        // Geospatial — nearby (if lat/lng provided)
        if (query.lat && query.lng) {
            const radiusInMeters = (query.radius || 10) * 1000; // default 10km
            filter.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [query.lng, query.lat],
                    },
                    $maxDistance: radiusInMeters,
                },
            };
        }

        const [spots, total] = await Promise.all([
            Spot.find(filter)
                .populate('city', 'name slug')
                .sort({ peaceScore: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Spot.countDocuments(filter),
        ]);

        return {
            spots,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total,
            },
        };
    },

    /**
     * Get single spot by ID
     */
    async getSpotById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw createError(400, 'Invalid spot ID');
        }

        const spot = await Spot.findOne({ _id: id, isApproved: true })
            .populate('city', 'name slug state')
            .populate('submittedBy', 'name avatar');

        if (!spot) {
            throw createError(404, 'Spot not found');
        }

        return spot;
    },

    /**
     * Trending spots — highest peace scores
     */
    async getTrending(limit: number = 10) {
        const spots = await Spot.find({ isApproved: true })
            .populate('city', 'name slug')
            .sort({ peaceScore: -1, isFeatured: -1 })
            .limit(limit);

        return spots;
    },

    /**
     * Nearby spots — geospatial query with pagination
     */
    async getNearby(lat: number, lng: number, radiusKm: number = 10, limit: number = 20, page: number = 1) {
        const skip = (page - 1) * limit;

        const spots = await Spot.aggregate([
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [lng, lat] },
                    distanceField: 'distance',
                    maxDistance: radiusKm * 1000, // convert km to meters
                    spherical: true,
                    query: { isApproved: true },
                },
            },
            {
                $facet: {
                    spots: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $lookup: {
                                from: 'cities',
                                localField: 'city',
                                foreignField: '_id',
                                as: 'city',
                            },
                        },
                        { $unwind: { path: '$city', preserveNullAndEmptyArrays: true } },
                        {
                            $project: {
                                title: 1,
                                description: 1,
                                location: 1,
                                categories: 1,
                                vibe: 1,
                                bestTime: 1,
                                crowdLevel: 1,
                                images: 1,
                                peaceScore: 1,
                                activities: 1,
                                address: 1,
                                distanceMeters: { $round: ['$distance', 0] },
                                distanceKm: { $round: [{ $divide: ['$distance', 1000] }, 1] },
                                'city.name': 1,
                                'city.slug': 1,
                            },
                        },
                    ],
                    totalCount: [{ $count: 'count' }],
                },
            },
        ]);

        const result = spots[0];
        const total = result.totalCount.length > 0 ? result.totalCount[0].count : 0;

        return {
            spots: result.spots,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total,
            },
        };
    },

    /**
     * Submit a new spot for review
     */
    async submitSpot(userId: string, data: any) {
        const submission = await SpotSubmission.create({
            ...data,
            submittedBy: userId,
            status: 'pending',
        });

        return submission;
    },

    /**
     * Get reviews for a spot
     */
    async getReviews(spotId: string, page: number = 1, limit: number = 10) {
        if (!mongoose.Types.ObjectId.isValid(spotId)) throw createError(400, 'Invalid spot ID');

        const skip = (page - 1) * limit;

        // Import here to avoid circular dependency if any, but better to import at top
        const { Review } = require('../../models/Review');

        const [reviews, total] = await Promise.all([
            Review.find({ spot: spotId })
                .populate('user', 'name avatar')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Review.countDocuments({ spot: spotId })
        ]);

        return {
            reviews,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        };
    },

    /**
     * Add a review to a spot
     */
    async addReview(spotId: string, userId: string, data: { rating: number, text: string }) {
        if (!mongoose.Types.ObjectId.isValid(spotId)) throw createError(400, 'Invalid spot ID');

        const { Review } = require('../../models/Review');

        try {
            const review = await Review.create({
                spot: spotId,
                user: userId,
                rating: data.rating,
                text: data.text
            });

            // Recalculate peace score for spot?
            // Optional enhancement: update Spot's peaceScore avg based on reviews.

            return review;
        } catch (error: any) {
            if (error.code === 11000) {
                throw createError(409, 'You have already reviewed this spot');
            }
            throw error;
        }
    },

    /**
     * Get discovery metadata for filters
     */
    async getDiscoveryMetadata() {
        const cities = await City.find({ isActive: true }).select('name slug').sort({ name: 1 });
        
        const categories = [
            { id: 'park', name: 'Parks' },
            { id: 'cafe', name: 'Cafes' },
            { id: 'library', name: 'Libraries' },
            { id: 'temple', name: 'Spiritual' },
            { id: 'nature', name: 'Nature' },
            { id: 'viewpoint', name: 'Viewpoints' },
            { id: 'authentic-experiences', name: 'Authentic Experiences' }
        ];

        const vibes = [
            { id: 'very-calm', name: 'Very Calm' },
            { id: 'moderate', name: 'Moderate' },
            { id: 'energetic', name: 'Energetic' }
        ];

        const travelerTypes = [
            { id: 'slow-traveler', name: 'Slow Traveler' },
            { id: 'cultural-explorer', name: 'Cultural Explorer' },
            { id: 'foodie', name: 'Foodie' },
            { id: 'photographer', name: 'Photographer' },
            { id: 'wellness-seeker', name: 'Wellness Seeker' },
            { id: 'solo-female', name: 'Solo Female' },
            { id: 'history-lover', name: 'History Lover' },
        ];

        return { cities, categories, vibes, travelerTypes };
    }
};
