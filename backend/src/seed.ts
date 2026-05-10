// ─────────────────────────────────────────────────────────────
// seed.ts — Populate database with Indian cities & sample spots
// Run: npm run seed
// ─────────────────────────────────────────────────────────────
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models/User';
import { City } from './models/City';
import { Spot } from './models/Spot';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/my-city-slow';

// ─── Cities Data ────────────────────────────────────────────
const citiesData = [
    { name: 'Bengaluru', slug: 'bengaluru', state: 'Karnataka', description: 'The Garden City — known for its pleasant weather, parks, and lakes.' },
    { name: 'Mumbai', slug: 'mumbai', state: 'Maharashtra', description: 'The City of Dreams — find hidden pockets of peace amidst the bustle.' },
    { name: 'Delhi', slug: 'delhi', state: 'Delhi', description: 'The Capital — ancient monuments and quiet heritage spots await.' },
    { name: 'Hyderabad', slug: 'hyderabad', state: 'Telangana', description: 'The City of Pearls — serene lakes and historic gardens.' },
    { name: 'Chennai', slug: 'chennai', state: 'Tamil Nadu', description: 'The Gateway to South India — peaceful beaches and temple towns.' },
    { name: 'Pune', slug: 'pune', state: 'Maharashtra', description: 'The Oxford of the East — hills, gardens, and a vibrant café culture.' },
    { name: 'Kolkata', slug: 'kolkata', state: 'West Bengal', description: 'The City of Joy — colonial-era parks and riverside walks.' },
    { name: 'Ahmedabad', slug: 'ahmedabad', state: 'Gujarat', description: 'Heritage City — stepwells, quiet pols, and riverfront walks.' },
    { name: 'Jaipur', slug: 'jaipur', state: 'Rajasthan', description: 'The Pink City — forts, gardens, and regal calm.' },
    { name: 'Kochi', slug: 'kochi', state: 'Kerala', description: 'Queen of the Arabian Sea — backwaters, spice gardens, and serenity.' },
];

// ─── Spots Data ─────────────────────────────────────────────
const spotsData = [
    // Bengaluru
    { title: 'Cubbon Park', description: 'A 300-acre green lung in the heart of Bengaluru. Perfect for early morning walks, reading under Banyan trees, or simply watching the world slow down.', city: 'bengaluru', location: { type: 'Point' as const, coordinates: [77.5946, 12.9763] }, categories: ['parks', 'trails'], vibe: 'very-calm', bestTime: 'early-morning', crowdLevel: 'low', peaceScore: 9, activities: ['walking', 'photography', 'reading'], address: 'Kasturba Road, Bengaluru', isFeatured: true },
    { title: 'Sankey Tank', description: 'A serene lake surrounded by walking paths and tall trees. The evening light reflecting off the water is magical.', city: 'bengaluru', location: { type: 'Point' as const, coordinates: [77.5730, 13.0067] }, categories: ['lakes', 'trails'], vibe: 'very-calm', bestTime: 'evening', crowdLevel: 'very-low', peaceScore: 8.5, activities: ['walking', 'sitting-quietly', 'photography'], address: 'Sadashivanagar, Bengaluru' },
    { title: 'Lalbagh Botanical Garden', description: 'Historic botanical garden with a stunning glass house, rare plants, and peaceful morning vibes. A photographer\'s paradise.', city: 'bengaluru', location: { type: 'Point' as const, coordinates: [77.5855, 12.9507] }, categories: ['parks'], vibe: 'moderate', bestTime: 'morning', crowdLevel: 'medium', peaceScore: 8, activities: ['walking', 'photography'], address: 'Lalbagh, Bengaluru' },

    // Mumbai
    { title: 'Sanjay Gandhi National Park — Kanheri Caves Trail', description: 'An ancient Buddhist cave complex deep inside a national park. The trail through the forest is incredibly meditative.', city: 'mumbai', location: { type: 'Point' as const, coordinates: [72.9052, 19.2094] }, categories: ['trails', 'viewpoints'], vibe: 'very-calm', bestTime: 'early-morning', crowdLevel: 'low', peaceScore: 9.2, activities: ['walking', 'photography', 'running'], address: 'Borivali East, Mumbai', isFeatured: true },
    { title: 'Bandra Bandstand Promenade', description: 'A quiet seaside promenade with stunning views of the Arabian Sea and Bandra-Worli Sea Link. Best at sunset.', city: 'mumbai', location: { type: 'Point' as const, coordinates: [72.8190, 19.0504] }, categories: ['sunset', 'viewpoints'], vibe: 'moderate', bestTime: 'evening', crowdLevel: 'medium', peaceScore: 7.5, activities: ['walking', 'sitting-quietly', 'photography'], address: 'Bandstand, Bandra West, Mumbai' },

    // Delhi
    { title: 'Lodhi Garden', description: 'A serene 15th-century garden with Mughal-era tombs, fountains, and walking paths. A peaceful escape in the heart of Delhi.', city: 'delhi', location: { type: 'Point' as const, coordinates: [77.2195, 28.5930] }, categories: ['parks', 'trails'], vibe: 'very-calm', bestTime: 'early-morning', crowdLevel: 'low', peaceScore: 9, activities: ['walking', 'photography', 'sitting-quietly'], address: 'Lodhi Road, New Delhi', isFeatured: true },
    { title: 'Hauz Khas Deer Park', description: 'A quiet green space with a lake, deer enclosure, and ruins. The nearby village adds a cultural touch.', city: 'delhi', location: { type: 'Point' as const, coordinates: [77.1945, 28.5494] }, categories: ['parks', 'lakes'], vibe: 'very-calm', bestTime: 'morning', crowdLevel: 'low', peaceScore: 8.5, activities: ['walking', 'photography'], address: 'Hauz Khas, New Delhi' },

    // Hyderabad
    { title: 'Durgam Cheruvu Lake', description: 'A hidden lake nestled between rocks in the middle of Hyderabad\'s IT hub. Surprisingly peaceful and beautiful.', city: 'hyderabad', location: { type: 'Point' as const, coordinates: [78.3810, 17.4260] }, categories: ['lakes', 'viewpoints'], vibe: 'very-calm', bestTime: 'evening', crowdLevel: 'very-low', peaceScore: 8.8, activities: ['sitting-quietly', 'photography'], address: 'Madhapur, Hyderabad', isFeatured: true },
    { title: 'KBR National Park', description: 'A dense urban forest with walking trails, bird watching spots, and early-morning runners finding their peace.', city: 'hyderabad', location: { type: 'Point' as const, coordinates: [78.4330, 17.4144] }, categories: ['parks', 'trails'], vibe: 'very-calm', bestTime: 'early-morning', crowdLevel: 'low', peaceScore: 8.5, activities: ['walking', 'running', 'photography'], address: 'Jubilee Hills, Hyderabad' },

    // Chennai
    { title: 'Theosophical Society Gardens', description: 'A 260-acre garden with ancient Banyan trees, a serene beach, and absolute tranquility. One of Chennai\'s best-kept secrets.', city: 'chennai', location: { type: 'Point' as const, coordinates: [80.2707, 13.0339] }, categories: ['parks'], vibe: 'very-calm', bestTime: 'morning', crowdLevel: 'very-low', peaceScore: 9.5, activities: ['walking', 'sitting-quietly', 'photography'], address: 'Adyar, Chennai', isFeatured: true },
    { title: 'Elliot\'s Beach', description: 'A calmer alternative to Marina Beach. Perfect for quiet evening walks and watching the fishermen return.', city: 'chennai', location: { type: 'Point' as const, coordinates: [80.2720, 12.9988] }, categories: ['sunset', 'viewpoints'], vibe: 'moderate', bestTime: 'evening', crowdLevel: 'medium', peaceScore: 7.8, activities: ['walking', 'sitting-quietly'], address: 'Besant Nagar, Chennai' },

    // Pune
    { title: 'Vetal Tekdi', description: 'A green hillock in the middle of Pune with panoramic city views. The sunset here is incredible.', city: 'pune', location: { type: 'Point' as const, coordinates: [73.8273, 18.5122] }, categories: ['trails', 'sunset', 'viewpoints'], vibe: 'moderate', bestTime: 'evening', crowdLevel: 'medium', peaceScore: 8.2, activities: ['walking', 'running', 'photography'], address: 'Law College Road, Pune' },
    { title: 'Empress Garden', description: 'A beautifully maintained botanical garden from the British era. Quiet weekday mornings here are pure bliss.', city: 'pune', location: { type: 'Point' as const, coordinates: [73.8860, 18.5070] }, categories: ['parks'], vibe: 'very-calm', bestTime: 'morning', crowdLevel: 'low', peaceScore: 8, activities: ['walking', 'sitting-quietly', 'photography'], address: 'Race Course Road, Pune' },

    // Kolkata
    { title: 'Rabindra Sarobar', description: 'A peaceful man-made lake surrounded by trees and walking paths. Early mornings here feel like a different world.', city: 'kolkata', location: { type: 'Point' as const, coordinates: [88.3639, 22.5082] }, categories: ['lakes', 'trails'], vibe: 'very-calm', bestTime: 'early-morning', crowdLevel: 'low', peaceScore: 8.8, activities: ['walking', 'sitting-quietly'], address: 'Southern Avenue, Kolkata' },
    { title: 'Princep Ghat', description: 'A heritage monument along the Hooghly River. The evening breeze and view of the Vidyasagar Setu bridge is mesmerizing.', city: 'kolkata', location: { type: 'Point' as const, coordinates: [88.3312, 22.5545] }, categories: ['viewpoints', 'sunset'], vibe: 'moderate', bestTime: 'evening', crowdLevel: 'medium', peaceScore: 7.5, activities: ['sitting-quietly', 'photography'], address: 'Strand Road, Kolkata' },

    // Ahmedabad
    { title: 'Sabarmati Riverfront', description: 'A beautifully developed riverfront with walking paths, gardens, and a calming view of the Sabarmati River.', city: 'ahmedabad', location: { type: 'Point' as const, coordinates: [72.5714, 23.0395] }, categories: ['trails', 'viewpoints'], vibe: 'moderate', bestTime: 'evening', crowdLevel: 'medium', peaceScore: 7.8, activities: ['walking', 'running', 'photography'], address: 'Riverfront Road, Ahmedabad' },
    { title: 'Adalaj Stepwell', description: 'A stunning 15th-century stepwell with intricate carvings. The underground chambers stay remarkably cool and peaceful.', city: 'ahmedabad', location: { type: 'Point' as const, coordinates: [72.5827, 23.1685] }, categories: ['temples', 'viewpoints'], vibe: 'very-calm', bestTime: 'morning', crowdLevel: 'very-low', peaceScore: 9.0, activities: ['photography', 'sitting-quietly'], address: 'Adalaj, near Ahmedabad', isFeatured: true },

    // Jaipur
    { title: 'Nahargarh Fort Sunset Point', description: 'Drive up to Nahargarh Fort for one of the most breathtaking sunset views over the Pink City. Pure magic.', city: 'jaipur', location: { type: 'Point' as const, coordinates: [75.8152, 26.9387] }, categories: ['sunset', 'viewpoints'], vibe: 'very-calm', bestTime: 'evening', crowdLevel: 'low', peaceScore: 9.3, activities: ['photography', 'sitting-quietly'], address: 'Nahargarh Fort, Jaipur', isFeatured: true },

    // Kochi
    { title: 'Fort Kochi Beach', description: 'Watch the iconic Chinese fishing nets at sunset while the sea breeze carries away your stress. Timeless.', city: 'kochi', location: { type: 'Point' as const, coordinates: [76.2433, 9.9658] }, categories: ['sunset', 'viewpoints'], vibe: 'very-calm', bestTime: 'evening', crowdLevel: 'low', peaceScore: 9.0, activities: ['walking', 'sitting-quietly', 'photography'], address: 'Fort Kochi, Kochi' },
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            City.deleteMany({}),
            Spot.deleteMany({}),
        ]);
        console.log('🗑️  Cleared existing data');

        // Create admin user
        const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@1234', 12);
        const admin = await User.create({
            name: 'Admin',
            email: process.env.ADMIN_EMAIL || 'admin@mycityslow.com',
            password: adminPassword,
            role: 'admin',
            city: 'bengaluru',
        });
        console.log(`👤 Admin user created: ${admin.email}`);

        // Create demo user
        const demoPassword = await bcrypt.hash('Demo@1234', 12);
        await User.create({
            name: 'Demo User',
            email: 'demo@mycityslow.com',
            password: demoPassword,
            role: 'user',
            city: 'bengaluru',
        });
        console.log('👤 Demo user created: demo@mycityslow.com');

        // Create cities
        const cities = await City.insertMany(citiesData);
        console.log(`🏙️  ${cities.length} cities created`);

        // Create city slug-to-id map
        const cityMap = new Map(cities.map((c) => [c.slug, c._id]));

        // Create spots with city references
        const spotsWithCityIds = spotsData.map((spot) => ({
            ...spot,
            city: cityMap.get(spot.city),
            submittedBy: admin._id,
        }));

        const spots = await Spot.insertMany(spotsWithCityIds);
        console.log(`📍 ${spots.length} spots created`);

        // Update city total spots count
        for (const [slug, cityId] of cityMap) {
            const count = await Spot.countDocuments({ city: cityId });
            await City.findByIdAndUpdate(cityId, { totalSpots: count });
        }
        console.log('🔢 City spot counts updated');

        console.log('\n🌿 Seed completed successfully!');
        console.log('─────────────────────────────────');
        console.log('Admin login:  admin@mycityslow.com / Admin@1234');
        console.log('Demo login:   demo@mycityslow.com / Demo@1234');
        console.log('─────────────────────────────────\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seed();
