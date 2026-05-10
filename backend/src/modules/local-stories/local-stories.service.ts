import mongoose from 'mongoose';
import { LocalStory } from '../../models/LocalStory';
import { createError } from '../../middleware/errorHandler';

export const localStoriesService = {
    async getAll(page: number = 1, limit: number = 20, city?: string) {
        const skip = (page - 1) * limit;
        const filter: any = { isApproved: true };
        if (city) {
            filter.city = new mongoose.Types.ObjectId(city);
        }

        const [stories, total] = await Promise.all([
            LocalStory.find(filter)
                .populate('author', 'name avatar')
                .populate('city', 'name slug')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            LocalStory.countDocuments(filter),
        ]);

        return {
            stories,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total,
            },
        };
    },

    async getById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw createError(400, 'Invalid story ID');
        }

        const story = await LocalStory.findById(id)
            .populate('author', 'name avatar')
            .populate('city', 'name slug')
            .populate('spot', 'title slug')
            .populate('experience', 'title type');

        if (!story) {
            throw createError(404, 'Story not found');
        }

        return story;
    },

    async getBySpot(spotId: string) {
        if (!mongoose.Types.ObjectId.isValid(spotId)) {
            throw createError(400, 'Invalid spot ID');
        }

        const stories = await LocalStory.find({ spot: spotId, isApproved: true })
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 });

        return { stories };
    },

    async getByExperience(experienceId: string) {
        if (!mongoose.Types.ObjectId.isValid(experienceId)) {
            throw createError(400, 'Invalid experience ID');
        }

        const stories = await LocalStory.find({ experience: experienceId, isApproved: true })
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 });

        return { stories };
    },

    async create(userId: string, data: any) {
        const story = await LocalStory.create({
            ...data,
            author: userId,
            authorName: data.authorName || 'Local Explorer',
            isApproved: false,
        });

        return story;
    },

    async like(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw createError(400, 'Invalid story ID');
        }

        const story = await LocalStory.findByIdAndUpdate(
            id,
            { $inc: { likes: 1 } },
            { new: true },
        );

        if (!story) {
            throw createError(404, 'Story not found');
        }

        return { likes: story.likes };
    },
};
