// ─────────────────────────────────────────────────────────────
// Home: Service — personalized home screen data
// ─────────────────────────────────────────────────────────────
import { Spot } from '../../models/Spot';
import { City } from '../../models/City';
import { Experience } from '../../models/Experience';
import { CuratedGuide } from '../../models/CuratedGuide';
import { GlobalSettings } from '../../models/GlobalSettings';

// App categories for the home screen
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

export const homeService = {
    /**
     * Get personalized home data
     */
    async getHomeData(userCity?: string, platform?: string) {
        const hour = new Date().getHours();
        let greeting = 'Good morning';
        if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
        else if (hour >= 17 && hour < 21) greeting = 'Good evening';
        else if (hour >= 21) greeting = 'Good night';

        // Get user's city info (if provided)
        let cityInfo = null;
        let cityFilter: any = { isApproved: true };

        if (userCity) {
            const city = await City.findOne({ slug: userCity, isActive: true });
            if (city) {
                cityInfo = { name: city.name, slug: city.slug, state: city.state };
                cityFilter.city = city._id;
            }
        }

        // Trending spots (top 6 by peace score)
        const trending = await Spot.find(cityFilter)
            .populate('city', 'name slug')
            .sort({ peaceScore: -1, isFeatured: -1 })
            .limit(6);

        // Recommended spots (random approved spots)
        const recommended = await Spot.aggregate([
            { $match: { isApproved: true } },
            { $sample: { size: 6 } },
            {
                $lookup: {
                    from: 'cities',
                    localField: 'city',
                    foreignField: '_id',
                    as: 'city',
                },
            },
            { $unwind: { path: '$city', preserveNullAndEmptyArrays: true } },
        ]);

        // Authentic Experiences
        const authenticExperiences = await Experience.find({ isApproved: true })
            .populate('city', 'name slug')
            .sort({ peaceScore: -1 })
            .limit(6);

        // Curated Guides
        const guides = await CuratedGuide.find({ isPublished: true })
            .populate('city', 'name slug image')
            .sort({ createdAt: -1 })
            .limit(4);

        // Traveler type highlights
        const travelerTypes = [
            { id: 'slow-traveler', name: 'Slow Traveler', description: 'Take time to immerse, never rush' },
            { id: 'cultural-explorer', name: 'Cultural Explorer', description: 'Seek traditions, rituals, and local life' },
            { id: 'foodie', name: 'Foodie', description: 'Travel for taste, crave authentic flavors' },
            { id: 'photographer', name: 'Photographer', description: 'Frame stories through the lens' },
            { id: 'wellness-seeker', name: 'Wellness Seeker', description: 'Find peace through yoga, meditation, nature' },
            { id: 'solo-female', name: 'Solo Female', description: 'Travel independently, value safety & community' },
            { id: 'history-lover', name: 'History Lover', description: 'Chase stories etched in stone and time' },
        ];

        // Get all active cities for the dropdown
        const cities = await City.find({ isActive: true }).select('name slug _id').sort({ name: 1 });

        // Build cards array for platform-aware clients (Android)
        const cards: any[] = [
            { type: 'greeting', data: { greeting } },
            { type: 'city_info', data: cityInfo },
            { type: 'traveler_types', data: { types: travelerTypes } },
            { type: 'trending_spots', data: { spots: trending } },
            { type: 'authentic_experiences', data: { experiences: authenticExperiences } },
            { type: 'first_time_guide', data: cityInfo ? { cityName: cityInfo.name } : null },
            { type: 'categories', data: { categories: CATEGORIES } },
        ].filter(c => c.data !== null);

        // If platform is android, return cards-based format
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

        // Get dynamic settings
        let settings = await GlobalSettings.findOne();
        if (!settings) {
            return {
                success: true,
                message: 'Success',
                data: {
                    greeting,
                    cities,
                    hero: {
                        title: 'Find Peace in Your City',
                        subtitle: 'Rediscover the rhythm of intentional living. Uncover hidden sanctuaries and quiet corners designed for your wellbeing.',
                        backgroundImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=3000&auto=format&fit=crop',
                        phoneImage: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1000&auto=format&fit=crop'
                    },
                    philosophy: {
                        title: 'Philosophy of Presence',
                        subtitle: 'Why we advocate for a slower urban pace.',
                        cards: [
                            { title: 'Mental Clarity', description: 'Reducing noise and visual clutter allows your mind to rest and refocus on what truly matters in the present moment.', icon: 'sparkles' },
                            { title: 'Heart Rate', description: 'We curate spaces with proven low-decibel environments and high vegetation to naturally lower physiological stress.', icon: 'heart' },
                            { title: 'Urban Harmony', description: 'Fostering a deeper connection with the quiet natural elements that still exist within our bustling metropolitan homes.', icon: 'leaf' }
                        ]
                    },
                    cta: {
                        title: 'Ready to slow down?',
                        subtitle: 'Join a community of 50,000+ urban dwellers finding their sanctuary in the city.',
                        buttonText: 'Start Your Journey',
                        image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop'
                    },
                    cityInfo,
                    trending,
                    recommended,
                    authenticExperiences,
                    guides,
                    travelerTypes,
                    categories: CATEGORIES,
                    cards,
                },
            };
        }

        return {
            success: true,
            message: 'Success',
            data: {
                greeting,
                cities,
                hero: settings.hero,
                philosophy: settings.philosophy,
                cta: settings.cta,
                cityInfo,
                trending,
                recommended,
                authenticExperiences,
                guides,
                travelerTypes,
                categories: CATEGORIES,
                cards,
            },
        };
    },
};
