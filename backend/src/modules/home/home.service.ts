import { Spot } from '../../models/Spot';
import { City } from '../../models/City';
import { Experience } from '../../models/Experience';
import { CuratedGuide } from '../../models/CuratedGuide';
import { GlobalSettings } from '../../models/GlobalSettings';

const CATEGORIES = [
    { id: 'parks', name: 'Parks & Gardens', icon: '🌳', color: '#4CAF50' },
    { id: 'trails', name: 'Walking Trails', icon: '🥾', color: '#8BC34A' },
    { id: 'sunset', name: 'Sunset Points', icon: '🌅', color: '#FF9800' },
    { id: 'temples', name: 'Calm Temples', icon: '🛕', color: '#FF5722' },
    { id: 'cafes', name: 'Quiet Cafés', icon: '☕', color: '#795548' },
    { id: 'lakes', name: 'Lakes & Rivers', icon: '🏞️', color: '#2196F3' },
    { id: 'viewpoints', name: 'Viewpoints', icon: '🏔️', color: '#607D8B' },
    { id: 'libraries', name: 'Libraries', icon: '📚', color: '#9C27B0' },
    { id: 'authentic-experiences', name: 'Authentic Experiences', icon: '🎭', color: '#E91E63' },
];

async function fetchWeather(lat: number, lng: number) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.current_weather) {
            const temp = Math.round(data.current_weather.temperature);
            const code = data.current_weather.weathercode;
            const icon = code < 3 ? '☀️' : code < 30 ? '⛅' : code < 50 ? '☁️' : '🌧️';
            const status = code < 3 ? 'Clear Skies' : code < 30 ? 'Partly Cloudy' : code < 50 ? 'Cloudy' : 'Rainy';
            return { temperature: `${temp}°C`, icon, status };
        }
    } catch (_) {}
    return { temperature: '24°C', icon: '☀️', status: 'Clear Skies' };
}

async function findNearestCity(lat: number, lng: number) {
    try {
        const spots = await Spot.aggregate([
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [lng, lat] },
                    distanceField: 'distance',
                    maxDistance: 50000,
                    spherical: true,
                    query: { isApproved: true },
                },
            },
            { $sort: { distance: 1 } },
            { $limit: 1 },
            {
                $lookup: {
                    from: 'cities',
                    localField: 'city',
                    foreignField: '_id',
                    as: 'city',
                },
            },
            { $unwind: { path: '$city', preserveNullAndEmptyArrays: true } },
            { $replaceRoot: { newRoot: '$city' } },
        ]);
        return spots.length > 0 ? spots[0] : null;
    } catch (_) {
        return null;
    }
}

async function getTrendingNearby(lat: number, lng: number, limit: number = 5) {
    try {
        const spots = await Spot.aggregate([
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [lng, lat] },
                    distanceField: 'distance',
                    maxDistance: 15000,
                    spherical: true,
                    query: { isApproved: true },
                },
            },
            { $sort: { peaceScore: -1 } },
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
                    _id: 1, title: 1, description: 1, slug: 1,
                    images: 1, categories: 1, peaceScore: 1, vibe: 1,
                    bestTime: 1, crowdLevel: 1, address: 1, tags: 1,
                    entryFee: 1, timings: 1, openingHours: 1,
                    travelerTypes: 1, isTouristFriendly: 1, localStory: 1,
                    bestForTravelers: 1,
                    location: 1,
                    distanceKm: { $round: [{ $divide: ['$distance', 1000] }, 1] },
                    'city.name': 1, 'city.slug': 1,
                },
            },
        ]);
        return spots;
    } catch (_) {
        return [];
    }
}

export const homeService = {
    async getHomeData(userCity?: string, platform?: string, lat?: number, lng?: number) {
        const hour = new Date().getHours();
        let greeting = 'Good morning';
        if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
        else if (hour >= 17 && hour < 21) greeting = 'Good evening';
        else if (hour >= 21) greeting = 'Good night';

        let cityInfo = null;
        const cityFilter: any = { isApproved: true };

        if (lat && lng) {
            const nearestCity = await findNearestCity(lat, lng);
            if (nearestCity) {
                cityInfo = { name: nearestCity.name, slug: nearestCity.slug, state: nearestCity.state };
                cityFilter.city = nearestCity._id;
            }
        }

        if (!cityInfo && userCity) {
            const city = await City.findOne({ slug: userCity, isActive: true });
            if (city) {
                cityInfo = { name: city.name, slug: city.slug, state: city.state };
                cityFilter.city = city._id;
            }
        }

        const [trendingProm, nearbyProm, weatherProm] = await Promise.all([
            Spot.find(cityFilter)
                .populate('city', 'name slug')
                .sort({ peaceScore: -1, isFeatured: -1 })
                .limit(5),
            lat && lng ? getTrendingNearby(lat, lng, 5) : Promise.resolve([]),
            lat && lng ? fetchWeather(lat, lng) : Promise.resolve({ temperature: '24°C', icon: '☀️', status: 'Clear Skies' }),
        ]);

        const weather = weatherProm;
        const trending = trendingProm;
        const nearby = nearbyProm;

        const locationLabel = cityInfo ? cityInfo.name.toUpperCase() : 'Discover';
        const cityName = cityInfo ? cityInfo.name : '';

        const cities = await City.find({ isActive: true }).select('name slug _id').sort({ name: 1 });

        const cards: any[] = [
            {
                type: 'hero_card',
                data: {
                    cityName: cityName,
                    citySlug: cityInfo?.slug || '',
                    locationLabel,
                    weather: weather.temperature,
                    weatherStatus: weather.status,
                    weatherIcon: weather.icon,
                    description: 'Find your peace in the city.',
                    buttonText: cityInfo ? `Explore ${cityName} →` : 'Discover More',
                    backgroundImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2000&auto=format&fit=crop',
                },
            },
        ];

        if (nearby.length > 0) {
            cards.push({
                type: 'nearby_spots',
                data: {
                    title: 'Trending Nearby',
                    seeAllText: 'See All',
                    spots: nearby,
                },
            });
        }
            {
                type: 'trending_spots',
                data: {
                    title: 'Peaceful Spots',
                    seeAllText: 'See All',
                    spots: trending,
                },
            },
            {
                type: 'categories',
                data: {
                    title: 'Explore by Vibe',
                    seeAllText: 'See All',
                    categories: CATEGORIES,
                },
            },
        ];

        if (platform === 'android') {
            return {
                success: true,
                message: 'Success',
                data: {
                    greeting,
                    cards,
                    cities,
                },
            };
        }

        const authenticExperiences = await Experience.find({ isApproved: true })
            .populate('city', 'name slug')
            .sort({ peaceScore: -1 })
            .limit(6);

        const guides = await CuratedGuide.find({ isPublished: true })
            .populate('city', 'name slug image')
            .sort({ createdAt: -1 })
            .limit(4);

        let settings = await GlobalSettings.findOne();

        return {
            success: true,
            message: 'Success',
            data: {
                greeting,
                cities,
                hero: settings?.hero || {
                    title: 'Find Peace in Your City',
                    subtitle: 'Rediscover the rhythm of intentional living.',
                    backgroundImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=3000&auto=format&fit=crop',
                    phoneImage: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1000&auto=format&fit=crop',
                },
                philosophy: settings?.philosophy || {
                    title: 'Philosophy of Presence',
                    subtitle: 'Why we advocate for a slower urban pace.',
                    cards: [
                        { title: 'Mental Clarity', description: 'Reducing noise allows your mind to rest.', icon: 'sparkles' },
                        { title: 'Heart Rate', description: 'Low-decibel environments lower stress.', icon: 'heart' },
                        { title: 'Urban Harmony', description: 'Connect with nature in the city.', icon: 'leaf' },
                    ],
                },
                cta: settings?.cta || {
                    title: 'Ready to slow down?',
                    subtitle: 'Join a community finding sanctuary in the city.',
                    buttonText: 'Start Your Journey',
                    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop',
                },
                cityInfo,
                trending,
                authenticExperiences,
                guides,
                cards,
            },
        };
    },
};
