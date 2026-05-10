import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Spot } from './models/Spot';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/my-city-slow';

const spotCategoryImages: Record<string, string[]> = {
    parks: [
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1400&auto=format&fit=crop',
    ],
    trails: [
        'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1400&auto=format&fit=crop',
    ],
    lakes: [
        'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop',
    ],
    sunset: [
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1493244040629-496f6d136cc3?q=80&w=1400&auto=format&fit=crop',
    ],
    viewpoints: [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop',
    ],
    temples: [
        'https://images.unsplash.com/photo-1532664189809-02133fee698d?q=80&w=1400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1400&auto=format&fit=crop',
    ],
    temple: [
        'https://images.unsplash.com/photo-1532664189809-02133fee698d?q=80&w=1400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1400&auto=format&fit=crop',
    ],
    gardens: [
        'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=1400&auto=format&fit=crop',
    ],
    default: [
        'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1400&auto=format&fit=crop',
    ],
};

function getSpotImages(categories: string[] = []): string[] {
    const primaryCategory = categories[0]?.toLowerCase();
    return spotCategoryImages[primaryCategory] || spotCategoryImages.default;
}

async function backfillSpotImages() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const spots = await Spot.find({
            $or: [{ images: { $exists: false } }, { images: { $size: 0 } }],
        }).select('_id title categories images');

        if (!spots.length) {
            console.log('No spots need image backfill.');
            return;
        }

        const bulkOps = spots.map((spot) => ({
            updateOne: {
                filter: { _id: spot._id },
                update: { $set: { images: getSpotImages(spot.categories || []) } },
            },
        }));

        const result = await Spot.bulkWrite(bulkOps);
        console.log(`Backfilled images for ${result.modifiedCount} spots.`);
    } catch (error) {
        console.error('Backfill failed:', error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

backfillSpotImages();
