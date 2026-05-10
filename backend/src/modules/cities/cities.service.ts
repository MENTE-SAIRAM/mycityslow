import { City } from '../../models/City';
import { Spot } from '../../models/Spot';
import { Experience } from '../../models/Experience';
import { CuratedGuide } from '../../models/CuratedGuide';
import { createError } from '../../middleware/errorHandler';

export const citiesService = {
    async getAllCities() {
        const cities = await City.find({ isActive: true }).sort({ name: 1 });
        return cities;
    },

    async getCityBySlug(slug: string) {
        const city = await City.findOne({ slug, isActive: true });
        if (!city) {
            throw createError(404, 'City not found');
        }

        const spotCount = await Spot.countDocuments({ city: city._id, isApproved: true });
        const experienceCount = await Experience.countDocuments({ city: city._id, isVerified: true });

        return {
            ...city.toObject(),
            totalSpots: spotCount,
            totalExperiences: experienceCount,
        };
    },

    async getSlowGuide(citySlug: string) {
        const city = await City.findOne({ slug: citySlug, isActive: true });
        if (!city) {
            throw createError(404, 'City not found');
        }

        const spots = await Spot.find({ city: city._id, isApproved: true })
            .populate('city', 'name slug')
            .sort({ peaceScore: -1 });

        const experiences = await Experience.find({ city: city._id, isVerified: true })
            .populate('city', 'name slug')
            .sort({ rating: -1 });

        let guide = await CuratedGuide.findOne({ city: city._id, isPublished: true })
            .populate('city', 'name slug state image description');

        return {
            city,
            guide: guide || null,
            spots,
            experiences,
        };
    },
};
