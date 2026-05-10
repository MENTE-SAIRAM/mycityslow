import mongoose from 'mongoose';
import { Experience, EXPERIENCE_TYPES, TRAVELER_TYPES } from '../../models/Experience';
import { City } from '../../models/City';
import { createError } from '../../middleware/errorHandler';

interface ExperienceQuery {
    city?: string;
    type?: string;
    category?: string;
    travelerType?: string;
    priceRange?: string;
    duration?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export const experiencesService = {
    async discoverExperiences(query: ExperienceQuery) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;

        const filter: any = { isVerified: true };

        if (query.city) {
            const city = await City.findOne({ slug: query.city });
            if (city) filter.city = city._id;
        }

        if (query.type) {
            filter.type = query.type;
        }

        if (query.category) {
            filter.categories = { $in: [query.category] };
        }

        if (query.travelerType) {
            filter.travelerTypes = { $in: [query.travelerType] };
        }

        if (query.priceRange) {
            filter.priceRange = query.priceRange;
        }

        if (query.search) {
            filter.$text = { $search: query.search };
        }

        const [experiences, total] = await Promise.all([
            Experience.find(filter)
                .populate('city', 'name slug state')
                .sort({ rating: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Experience.countDocuments(filter),
        ]);

        return {
            experiences,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total,
            },
        };
    },

    async getExperienceById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw createError(400, 'Invalid experience ID');
        }

        const experience = await Experience.findOne({ _id: id, isVerified: true })
            .populate('city', 'name slug state')
            .populate('submittedBy', 'name avatar');

        if (!experience) {
            throw createError(404, 'Experience not found');
        }

        return experience;
    },

    async getFilterMetadata() {
        const cities = await City.find({ isActive: true }).select('name slug').sort({ name: 1 });

        return {
            cities,
            experienceTypes: EXPERIENCE_TYPES,
            travelerTypes: TRAVELER_TYPES,
            priceRanges: [
                { id: 'free', name: 'Free' },
                { id: 'budget', name: 'Budget (Under ₹500)' },
                { id: 'moderate', name: 'Moderate (₹500-₹2000)' },
                { id: 'premium', name: 'Premium (₹2000+)' },
            ],
        };
    },

    async submitExperience(userId: string, data: any) {
        const experience = await Experience.create({
            ...data,
            submittedBy: userId,
            isVerified: false,
        });
        return experience;
    },
};
