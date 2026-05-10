// ─────────────────────────────────────────────────────────────
// Cities: Service
// ─────────────────────────────────────────────────────────────
import { City } from '../../models/City';
import { Spot } from '../../models/Spot';
import { createError } from '../../middleware/errorHandler';

export const citiesService = {
    /**
     * Get all active cities
     */
    async getAllCities() {
        const cities = await City.find({ isActive: true }).sort({ name: 1 });
        return cities;
    },

    /**
     * Get city by slug with spot count
     */
    async getCityBySlug(slug: string) {
        const city = await City.findOne({ slug, isActive: true });
        if (!city) {
            throw createError(404, 'City not found');
        }

        // Get actual spot count
        const spotCount = await Spot.countDocuments({ city: city._id, isApproved: true });

        return {
            ...city.toObject(),
            totalSpots: spotCount,
        };
    },
};
