// ─────────────────────────────────────────────────────────────
// seed-mumbai-additional.ts — Add additional Mumbai spots
// Run: npx ts-node src/seed-mumbai-additional.ts
// ─────────────────────────────────────────────────────────────
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { City } from './models/City';
import { Spot } from './models/Spot';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/my-city-slow';

const additionalMumbaiSpots = [
    {
        title: 'Hanging Gardens Quiet Corner',
        address: 'Malabar Hill, Mumbai',
        categories: ['gardens', 'sunset'],
        activities: ['sunset', 'views'],
        location: { type: 'Point' as const, coordinates: [72.8047, 18.9560] },
        vibe: 'moderate' as const,
        openingHours: '6:00 AM - 9:00 PM',
        crowdLevel: 'medium' as const,
        peaceScore: 9.2,
        bestTime: 'evening' as const,
        description: 'One of the most iconic peaceful spots in South Mumbai with stunning sea views.',
    },
    {
        title: 'Priyadarshini Park',
        address: 'Napean Sea Road, Mumbai',
        categories: ['parks', 'sea'],
        activities: ['walking', 'sea view'],
        location: { type: 'Point' as const, coordinates: [72.7950, 18.9600] },
        vibe: 'moderate' as const,
        openingHours: '6:00 AM - 8:00 PM',
        crowdLevel: 'low' as const,
        peaceScore: 9.1,
        bestTime: 'early-morning' as const,
        description: 'Beautiful seaside park with refreshing breeze.',
    },
    {
        title: 'The Teal Door Cafe',
        address: 'Bandra West, Mumbai',
        categories: ['quiet cafe'],
        activities: ['reading', 'work', 'chill'],
        location: { type: 'Point' as const, coordinates: [72.8300, 19.0600] },
        vibe: 'moderate' as const,
        openingHours: '8:00 AM - 11:00 PM',
        crowdLevel: 'low' as const,
        peaceScore: 9.0,
        bestTime: 'morning' as const,
        description: 'A hidden gem cafe known for its extremely quiet and aesthetic ambiance. Perfect for deep work, reading, or peaceful conversations. Soft lighting and comfortable seating make it ideal for slow living.',
    },
    {
        title: 'Kala Ghoda Cafe',
        address: 'Kala Ghoda, Mumbai',
        categories: ['quiet cafe'],
        activities: ['coffee', 'work', 'art'],
        location: { type: 'Point' as const, coordinates: [72.8300, 18.9300] },
        vibe: 'moderate' as const,
        openingHours: '8:30 AM - 10:00 PM',
        crowdLevel: 'low' as const,
        peaceScore: 8.9,
        bestTime: 'morning' as const,
        description: 'An artsy, calm cafe in the heritage Kala Ghoda area. Excellent for sitting quietly with a book or laptop.',
    },
    {
        title: 'The Bombay Canteen Garden Area',
        address: 'Lower Parel, Mumbai',
        categories: ['quiet cafe'],
        activities: ['relaxing', 'dining'],
        location: { type: 'Point' as const, coordinates: [72.8300, 19.0000] },
        vibe: 'energetic' as const,
        openingHours: '9:00 AM - 11:00 PM',
        crowdLevel: 'low' as const,
        peaceScore: 8.7,
        bestTime: 'evening' as const,
        description: 'The outdoor garden seating area is surprisingly peaceful even during evenings.',
    },
    {
        title: 'Siddhivinayak Temple Garden',
        address: 'Prabhadevi, Mumbai',
        categories: ['temple'],
        activities: ['prayer', 'meditation'],
        location: { type: 'Point' as const, coordinates: [72.8300, 19.0200] },
        vibe: 'energetic' as const,
        openingHours: '5:00 AM - 10:00 PM',
        crowdLevel: 'medium' as const,
        peaceScore: 9.1,
        bestTime: 'early-morning' as const,
        description: 'One of Mumbai\'s most famous temples. The surrounding garden area is surprisingly calm early morning.',
    },
    {
        title: 'Mahalakshmi Temple',
        address: 'Mahalaxmi, Mumbai',
        categories: ['temple'],
        activities: ['prayer', 'quiet'],
        location: { type: 'Point' as const, coordinates: [72.8000, 18.9800] },
        vibe: 'energetic' as const,
        openingHours: '5:00 AM - 9:00 PM',
        crowdLevel: 'medium' as const,
        peaceScore: 8.8,
        bestTime: 'early-morning' as const,
        description: 'Historic temple located near the sea with a peaceful courtyard.',
    },
    {
        title: 'Walkeshwar Temple',
        address: 'Malabar Hill, Mumbai',
        categories: ['temple'],
        activities: ['meditation', 'prayer'],
        location: { type: 'Point' as const, coordinates: [72.8000, 18.9500] },
        vibe: 'moderate' as const,
        openingHours: '5:30 AM - 9:00 PM',
        crowdLevel: 'low' as const,
        peaceScore: 8.9,
        bestTime: 'early-morning' as const,
        description: 'Ancient temple with a very spiritual and calm atmosphere.',
    },
    {
        title: 'Bandra Fort Garden',
        address: 'Bandra, Mumbai',
        categories: ['historical', 'gardens'],
        activities: ['views', 'relaxing'],
        location: { type: 'Point' as const, coordinates: [72.8200, 19.0500] },
        vibe: 'very-calm' as const,
        openingHours: '6:00 AM - 7:00 PM',
        crowdLevel: 'low' as const,
        peaceScore: 8.7,
        bestTime: 'morning' as const,
        description: 'Beautiful garden with sea views near the old fort.',
    },
    {
        title: 'Global Fusion Cafe',
        address: 'Andheri West, Mumbai',
        categories: ['quiet cafe'],
        activities: ['work', 'chill'],
        location: { type: 'Point' as const, coordinates: [72.8300, 19.1300] },
        vibe: 'moderate' as const,
        openingHours: '7:30 AM - 11:00 PM',
        crowdLevel: 'low' as const,
        peaceScore: 8.6,
        bestTime: 'morning' as const,
        description: 'A quiet cafe popular among professionals for calm work sessions.',
    },
];

const spotCategoryImages: Record<string, string[]> = {
    parks: [
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1400&auto=format&fit=crop',
    ],
    temple: [
        'https://images.unsplash.com/photo-1532664189809-02133fee698d?q=80&w=1400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1400&auto=format&fit=crop',
    ],
    gardens: [
        'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=1400&auto=format&fit=crop',
    ],
    sunset: [
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1493244040629-496f6d136cc3?q=80&w=1400&auto=format&fit=crop',
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

async function seedAdditionalMumbaiSpots() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const mumbaiCity = await City.findOne({ slug: 'mumbai' });
        if (!mumbaiCity) {
            console.error('❌ Mumbai city not found in database. Run the main seed first.');
            process.exit(1);
        }

        console.log(`✅ Found city: ${mumbaiCity.name} (${mumbaiCity._id})`);

        let inserted = 0;
        let skipped = 0;

        for (const spotData of additionalMumbaiSpots) {
            const existing = await Spot.findOne({ title: spotData.title });
            if (existing) {
                console.log(`⏭  Skipping (already exists): ${spotData.title}`);
                skipped++;
                continue;
            }

            await Spot.create({
                ...spotData,
                city: mumbaiCity._id,
                isApproved: true,
                isFeatured: false,
                images: getSpotImages(spotData.categories),
                transportation: '',
            });

            console.log(`✅ Inserted: ${spotData.title}`);
            inserted++;
        }

        // Update city spot count
        const totalSpots = await Spot.countDocuments({ city: mumbaiCity._id, isApproved: true });
        await City.findByIdAndUpdate(mumbaiCity._id, { totalSpots });

        console.log(`\n🎉 Done! Inserted: ${inserted}, Skipped: ${skipped}`);
        console.log(`📊 Mumbai now has ${totalSpots} approved spots.`);
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seedAdditionalMumbaiSpots();
