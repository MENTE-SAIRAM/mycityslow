import { CuratedGuide } from '../../models/CuratedGuide';
import { City } from '../../models/City';
import { createError } from '../../middleware/errorHandler';

export const guidesService = {
    async getAll() {
        const guides = await CuratedGuide.find({ isPublished: true })
            .populate('city', 'name slug state image description')
            .sort({ createdAt: -1 });

        return { guides };
    },

    async getByCitySlug(citySlug: string) {
        const city = await City.findOne({ slug: citySlug, isActive: true });
        if (!city) {
            throw createError(404, 'City not found');
        }

        const guide = await CuratedGuide.findOne({ city: city._id, isPublished: true })
            .populate('city', 'name slug state image description')
            .populate({
                path: 'sections',
                populate: [
                    { path: 'spots', select: 'title images peaceScore categories vibe bestTime crowdLevel location' },
                    { path: 'experiences', select: 'title type images priceRange duration peaceScore' },
                ],
            });

        if (!guide) {
            throw createError(404, 'No guide found for this city');
        }

        return guide;
    },
};
