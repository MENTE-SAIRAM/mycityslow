// ─────────────────────────────────────────────────────────────
// Search: Service — search spots and cities
// ─────────────────────────────────────────────────────────────
import { Spot } from '../../models/Spot';
import { City } from '../../models/City';

export const searchService = {
    /**
     * Search spots and cities by text query
     */
    async search(query: string, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        if (!query || query.trim().length === 0) {
            return { spots: [], cities: [], pagination: { page, limit, total: 0, totalPages: 0 } };
        }

        const regex = new RegExp(query, 'i');

        // Search spots
        const [spots, spotCount] = await Promise.all([
            Spot.find({
                isApproved: true,
                $or: [
                    { title: regex },
                    { description: regex },
                    { address: regex },
                    { categories: { $in: [regex] } },
                ],
            })
                .populate('city', 'name slug')
                .sort({ peaceScore: -1 })
                .skip(skip)
                .limit(limit),
            Spot.countDocuments({
                isApproved: true,
                $or: [
                    { title: regex },
                    { description: regex },
                    { address: regex },
                ],
            }),
        ]);

        // Search cities
        const cities = await City.find({
            isActive: true,
            $or: [{ name: regex }, { state: regex }],
        }).limit(5);

        return {
            spots,
            cities,
            pagination: {
                page,
                limit,
                total: spotCount,
                totalPages: Math.ceil(spotCount / limit),
                hasMore: page * limit < spotCount,
            },
        };
    },
};
