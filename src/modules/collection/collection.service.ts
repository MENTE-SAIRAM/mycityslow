// ─────────────────────────────────────────────────────────────
// Collection: Service — user's "My Slow List"
// ─────────────────────────────────────────────────────────────
import mongoose from 'mongoose';
import { SavedSpot } from '../../models/SavedSpot';
import { Spot } from '../../models/Spot';
import { createError } from '../../middleware/errorHandler';

export const collectionService = {
    /**
     * Get user's saved spots
     */
    async getSavedSpots(userId: string, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        const [savedSpots, total] = await Promise.all([
            SavedSpot.find({ user: userId })
                .populate({
                    path: 'spot',
                    populate: { path: 'city', select: 'name slug' },
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            SavedSpot.countDocuments({ user: userId }),
        ]);

        return {
            spots: savedSpots.map((s) => s.spot),
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
     * Save a spot to collection
     */
    async saveSpot(userId: string, spotId: string) {
        if (!mongoose.Types.ObjectId.isValid(spotId)) {
            throw createError(400, 'Invalid spot ID');
        }

        // Check spot exists
        const spot = await Spot.findById(spotId);
        if (!spot) {
            throw createError(404, 'Spot not found');
        }

        // Check if already saved
        const existing = await SavedSpot.findOne({ user: userId, spot: spotId });
        if (existing) {
            throw createError(409, 'Spot already in your collection');
        }

        await SavedSpot.create({ user: userId, spot: spotId });
        return { message: 'Spot saved to your collection' };
    },

    /**
     * Remove a spot from collection
     */
    async removeSpot(userId: string, spotId: string) {
        if (!mongoose.Types.ObjectId.isValid(spotId)) {
            throw createError(400, 'Invalid spot ID');
        }

        const result = await SavedSpot.findOneAndDelete({ user: userId, spot: spotId });
        if (!result) {
            throw createError(404, 'Spot not found in your collection');
        }

        return { message: 'Spot removed from your collection' };
    },
};
