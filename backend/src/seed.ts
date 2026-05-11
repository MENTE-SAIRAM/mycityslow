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
import { Experience } from './models/Experience';
import { LocalStory } from './models/LocalStory';
import { CuratedGuide } from './models/CuratedGuide';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/my-city-slow';

// ─── Cities Data ────────────────────────────────────────────
const citiesData = [
    { name: 'Bengaluru', slug: 'bengaluru', state: 'Karnataka', description: 'The Garden City — known for its pleasant weather, parks, and lakes.', image: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?q=80&w=2000&auto=format&fit=crop' },
    { name: 'Mumbai', slug: 'mumbai', state: 'Maharashtra', description: 'The City of Dreams — find hidden pockets of peace amidst the bustle.', image: 'https://images.unsplash.com/photo-1529253355930-d2b1f2035c4b?q=80&w=2000&auto=format&fit=crop' },
    { name: 'Delhi', slug: 'delhi', state: 'Delhi', description: 'The Capital — ancient monuments and quiet heritage spots await.', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2000&auto=format&fit=crop' },
    { name: 'Hyderabad', slug: 'hyderabad', state: 'Telangana', description: 'The City of Pearls — serene lakes and historic gardens.', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2000&auto=format&fit=crop' },
    { name: 'Chennai', slug: 'chennai', state: 'Tamil Nadu', description: 'The Gateway to South India — peaceful beaches and temple towns.', image: 'https://images.unsplash.com/photo-1581833055087-0ef44a939b0a?q=80&w=2000&auto=format&fit=crop' },
    { name: 'Pune', slug: 'pune', state: 'Maharashtra', description: 'The Oxford of the East — hills, gardens, and a vibrant café culture.', image: 'https://images.unsplash.com/photo-1624397640148-949b1732bb0f?q=80&w=2000&auto=format&fit=crop' },
    { name: 'Kolkata', slug: 'kolkata', state: 'West Bengal', description: 'The City of Joy — colonial-era parks and riverside walks.', image: 'https://images.unsplash.com/photo-1571757700470-0f7b66eb4813?q=80&w=2000&auto=format&fit=crop' },
    { name: 'Ahmedabad', slug: 'ahmedabad', state: 'Gujarat', description: 'Heritage City — stepwells, quiet pols, and riverfront walks.', image: 'https://images.unsplash.com/photo-1600515911074-18d12708cce6?q=80&w=2000&auto=format&fit=crop' },
    { name: 'Jaipur', slug: 'jaipur', state: 'Rajasthan', description: 'The Pink City — forts, gardens, and regal calm.', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2000&auto=format&fit=crop' },
    { name: 'Kochi', slug: 'kochi', state: 'Kerala', description: 'Queen of the Arabian Sea — backwaters, spice gardens, and serenity.', image: 'https://images.unsplash.com/photo-1593558132623-6849e5d0edff?q=80&w=2000&auto=format&fit=crop' },
    { name: 'Varanasi', slug: 'varanasi', state: 'Uttar Pradesh', description: 'The spiritual capital of India — ghats, Ganga aarti, and timeless serenity.', image: 'https://images.unsplash.com/photo-1569121239039-5ea97e421392?q=80&w=2000&auto=format&fit=crop' },
    { name: 'Udaipur', slug: 'udaipur', state: 'Rajasthan', description: 'The City of Lakes — romantic sunsets, heritage havelis, and serene boat rides.', image: 'https://images.unsplash.com/photo-1587467538309-de218c1e2f38?q=80&w=2000&auto=format&fit=crop' },
];

// ─── Spots Data ─────────────────────────────────────────────
const spotsData = [
    // Bengaluru
    { title: 'Cubbon Park', description: 'A 300-acre green lung in the heart of Bengaluru. Perfect for early morning walks, reading under Banyan trees, or simply watching the world slow down.', city: 'bengaluru', location: { type: 'Point' as const, coordinates: [77.5946, 12.9763] }, categories: ['parks', 'trails'], vibe: 'very-calm', bestTime: 'early-morning', crowdLevel: 'low', peaceScore: 9, activities: ['walking', 'photography', 'reading'], address: 'Kasturba Road, Bengaluru', isFeatured: true },
    { title: 'Sankey Tank', description: 'A serene lake surrounded by walking paths and tall trees. The evening light reflecting off the water is magical.', city: 'bengaluru', location: { type: 'Point' as const, coordinates: [77.5730, 13.0067] }, categories: ['lakes', 'trails'], vibe: 'very-calm', bestTime: 'evening', crowdLevel: 'very-low', peaceScore: 8.5, activities: ['walking', 'sitting-quietly', 'photography'], address: 'Sadashivanagar, Bengaluru' },
    { title: 'Lalbagh Botanical Garden', description: 'Historic botanical garden with a stunning glass house, rare plants, and peaceful morning vibes. A photographer\'s paradise.', city: 'bengaluru', location: { type: 'Point' as const, coordinates: [77.5855, 12.9507] }, categories: ['parks'], vibe: 'energetic', bestTime: 'morning', crowdLevel: 'medium', peaceScore: 8, activities: ['walking', 'photography'], address: 'Lalbagh, Bengaluru' },

    // Mumbai
    { title: 'Sanjay Gandhi National Park — Kanheri Caves Trail', description: 'An ancient Buddhist cave complex deep inside a national park. The trail through the forest is incredibly meditative.', city: 'mumbai', location: { type: 'Point' as const, coordinates: [72.9052, 19.2094] }, categories: ['trails', 'viewpoints'], vibe: 'moderate', bestTime: 'early-morning', crowdLevel: 'low', peaceScore: 9.2, activities: ['walking', 'photography', 'running'], address: 'Borivali East, Mumbai', isFeatured: true },
    { title: 'Bandra Bandstand Promenade', description: 'A quiet seaside promenade with stunning views of the Arabian Sea and Bandra-Worli Sea Link. Best at sunset.', city: 'mumbai', location: { type: 'Point' as const, coordinates: [72.8190, 19.0504] }, categories: ['sunset', 'viewpoints'], vibe: 'energetic', bestTime: 'evening', crowdLevel: 'medium', peaceScore: 7.5, activities: ['walking', 'sitting-quietly', 'photography'], address: 'Bandstand, Bandra West, Mumbai' },

    // Delhi
    { title: 'Lodhi Garden', description: 'A serene 15th-century garden with Mughal-era tombs, fountains, and walking paths. A peaceful escape in the heart of Delhi.', city: 'delhi', location: { type: 'Point' as const, coordinates: [77.2195, 28.5930] }, categories: ['parks', 'trails'], vibe: 'moderate', bestTime: 'early-morning', crowdLevel: 'low', peaceScore: 9, activities: ['walking', 'photography', 'sitting-quietly'], address: 'Lodhi Road, New Delhi', isFeatured: true },
    { title: 'Hauz Khas Deer Park', description: 'A quiet green space with a lake, deer enclosure, and ruins. The nearby village adds a cultural touch.', city: 'delhi', location: { type: 'Point' as const, coordinates: [77.1945, 28.5494] }, categories: ['parks', 'lakes'], vibe: 'very-calm', bestTime: 'morning', crowdLevel: 'low', peaceScore: 8.5, activities: ['walking', 'photography'], address: 'Hauz Khas, New Delhi' },

    // Hyderabad
    { title: 'Durgam Cheruvu Lake', description: 'A hidden lake nestled between rocks in the middle of Hyderabad\'s IT hub. Surprisingly peaceful and beautiful.', city: 'hyderabad', location: { type: 'Point' as const, coordinates: [78.3810, 17.4260] }, categories: ['lakes', 'viewpoints'], vibe: 'very-calm', bestTime: 'evening', crowdLevel: 'very-low', peaceScore: 8.8, activities: ['sitting-quietly', 'photography'], address: 'Madhapur, Hyderabad', isFeatured: true },
    { title: 'KBR National Park', description: 'A dense urban forest with walking trails, bird watching spots, and early-morning runners finding their peace.', city: 'hyderabad', location: { type: 'Point' as const, coordinates: [78.4330, 17.4144] }, categories: ['parks', 'trails'], vibe: 'moderate', bestTime: 'early-morning', crowdLevel: 'low', peaceScore: 8.5, activities: ['walking', 'running', 'photography'], address: 'Jubilee Hills, Hyderabad' },

    // Chennai
    { title: 'Theosophical Society Gardens', description: 'A 260-acre garden with ancient Banyan trees, a serene beach, and absolute tranquility. One of Chennai\'s best-kept secrets.', city: 'chennai', location: { type: 'Point' as const, coordinates: [80.2707, 13.0339] }, categories: ['parks'], vibe: 'very-calm', bestTime: 'morning', crowdLevel: 'very-low', peaceScore: 9.5, activities: ['walking', 'sitting-quietly', 'photography'], address: 'Adyar, Chennai', isFeatured: true },
    { title: 'Elliot\'s Beach', description: 'A calmer alternative to Marina Beach. Perfect for quiet evening walks and watching the fishermen return.', city: 'chennai', location: { type: 'Point' as const, coordinates: [80.2720, 12.9988] }, categories: ['sunset', 'viewpoints'], vibe: 'energetic', bestTime: 'evening', crowdLevel: 'medium', peaceScore: 7.8, activities: ['walking', 'sitting-quietly'], address: 'Besant Nagar, Chennai' },

    // Pune
    { title: 'Vetal Tekdi', description: 'A green hillock in the middle of Pune with panoramic city views. The sunset here is incredible.', city: 'pune', location: { type: 'Point' as const, coordinates: [73.8273, 18.5122] }, categories: ['trails', 'sunset', 'viewpoints'], vibe: 'energetic', bestTime: 'evening', crowdLevel: 'medium', peaceScore: 8.2, activities: ['walking', 'running', 'photography'], address: 'Law College Road, Pune' },
    { title: 'Empress Garden', description: 'A beautifully maintained botanical garden from the British era. Quiet weekday mornings here are pure bliss.', city: 'pune', location: { type: 'Point' as const, coordinates: [73.8860, 18.5070] }, categories: ['parks'], vibe: 'very-calm', bestTime: 'morning', crowdLevel: 'low', peaceScore: 8, activities: ['walking', 'sitting-quietly', 'photography'], address: 'Race Course Road, Pune' },

    // Kolkata
    { title: 'Rabindra Sarobar', description: 'A peaceful man-made lake surrounded by trees and walking paths. Early mornings here feel like a different world.', city: 'kolkata', location: { type: 'Point' as const, coordinates: [88.3639, 22.5082] }, categories: ['lakes', 'trails'], vibe: 'very-calm', bestTime: 'early-morning', crowdLevel: 'low', peaceScore: 8.8, activities: ['walking', 'sitting-quietly'], address: 'Southern Avenue, Kolkata' },
    { title: 'Princep Ghat', description: 'A heritage monument along the Hooghly River. The evening breeze and view of the Vidyasagar Setu bridge is mesmerizing.', city: 'kolkata', location: { type: 'Point' as const, coordinates: [88.3312, 22.5545] }, categories: ['viewpoints', 'sunset'], vibe: 'energetic', bestTime: 'evening', crowdLevel: 'medium', peaceScore: 7.5, activities: ['sitting-quietly', 'photography'], address: 'Strand Road, Kolkata' },

    // Ahmedabad
    { title: 'Sabarmati Riverfront', description: 'A beautifully developed riverfront with walking paths, gardens, and a calming view of the Sabarmati River.', city: 'ahmedabad', location: { type: 'Point' as const, coordinates: [72.5714, 23.0395] }, categories: ['trails', 'viewpoints'], vibe: 'energetic', bestTime: 'evening', crowdLevel: 'medium', peaceScore: 7.8, activities: ['walking', 'running', 'photography'], address: 'Riverfront Road, Ahmedabad' },
    { title: 'Adalaj Stepwell', description: 'A stunning 15th-century stepwell with intricate carvings. The underground chambers stay remarkably cool and peaceful.', city: 'ahmedabad', location: { type: 'Point' as const, coordinates: [72.5827, 23.1685] }, categories: ['temples', 'viewpoints'], vibe: 'very-calm', bestTime: 'morning', crowdLevel: 'very-low', peaceScore: 9.0, activities: ['photography', 'sitting-quietly'], address: 'Adalaj, near Ahmedabad', isFeatured: true },

    // Jaipur
    { title: 'Nahargarh Fort Sunset Point', description: 'Drive up to Nahargarh Fort for one of the most breathtaking sunset views over the Pink City. Pure magic.', city: 'jaipur', location: { type: 'Point' as const, coordinates: [75.8152, 26.9387] }, categories: ['sunset', 'viewpoints'], vibe: 'moderate', bestTime: 'evening', crowdLevel: 'low', peaceScore: 9.3, activities: ['photography', 'sitting-quietly'], address: 'Nahargarh Fort, Jaipur', isFeatured: true },

    // Kochi
    { title: 'Fort Kochi Beach', description: 'Watch the iconic Chinese fishing nets at sunset while the sea breeze carries away your stress. Timeless.', city: 'kochi', location: { type: 'Point' as const, coordinates: [76.2433, 9.9658] }, categories: ['sunset', 'viewpoints'], vibe: 'moderate', bestTime: 'evening', crowdLevel: 'low', peaceScore: 9.0, activities: ['walking', 'sitting-quietly', 'photography'], address: 'Fort Kochi, Kochi' },
];

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

// ─── Authentic Experiences Data ─────────────────────────────
const experiencesData = [
    // ── Bengaluru (10 experiences) ──
    { title: 'Home-Cooked Kodava Meal with a Local Family', description: 'Spend an afternoon with a Kodava family in Coorgi Colony, learning to make traditional Pandi Curry and Akki Roti. Hear stories of Coorg culture while you eat on a banana leaf.', city: 'bengaluru', type: 'home-cooked-meal', categories: ['food', 'culture'], tags: ['kodava', 'coorgi', 'traditional'], travelerTypes: ['foodie', 'cultural-explorer'], location: { type: 'Point' as const, coordinates: [77.5946, 12.9716] }, priceRange: 'moderate', duration: '3 hours', hostName: 'Priya M.', hostContact: 'priya@example.com', languages: ['English', 'Kannada', 'Kodava'], includes: ['Cooking lesson', 'Traditional meal', 'Recipes to take home'], meetingPoint: 'BTM Layout, near NIFT College', vibe: 'peaceful', timing: '12:00 PM - 3:00 PM', rating: 9.5, isFeatured: true, isVerified: true },
    { title: 'Walking Through History — Malleshwaram Heritage Walk', description: 'Explore Bengaluru\'s oldest planned neighborhood with a local historian. Walk past century-old temples, iconic silk shops, and hear stories of how the garden city grew.', city: 'bengaluru', type: 'heritage-walk', categories: ['heritage', 'walking'], tags: ['history', 'architecture', 'temple'], travelerTypes: ['history-lover', 'slow-traveler', 'photographer'], location: { type: 'Point' as const, coordinates: [77.5683, 12.9932] }, priceRange: 'budget', duration: '2.5 hours', hostName: 'Ramesh K.', hostContact: 'ramesh@example.com', languages: ['English', 'Kannada', 'Hindi'], includes: ['Walking tour', 'Tea at a 100-year-old café', 'Digital photo guide'], meetingPoint: 'Malleshwaram Circle', vibe: 'peaceful', timing: '7:00 AM - 9:30 AM', rating: 9.0, isFeatured: true, isVerified: true },
    { title: 'Pottery & Terracotta Workshop with Local Artisans', description: 'Learn traditional pottery techniques from a family of artisans who have worked with clay for four generations. Make your own terracotta planter and diya.', city: 'bengaluru', type: 'craft-workshop', categories: ['craft', 'art'], tags: ['pottery', 'terracotta', 'hands-on'], travelerTypes: ['cultural-explorer', 'slow-traveler', 'wellness-seeker'], location: { type: 'Point' as const, coordinates: [77.5200, 12.8950] }, priceRange: 'moderate', duration: '4 hours', hostName: 'Venkatesh & Family', hostContact: 'venkatesh@example.com', languages: ['English', 'Kannada', 'Telugu'], includes: ['Materials', 'Firing', 'Your finished piece shipped home'], meetingPoint: 'Hoskote Village, 20km from city center', vibe: 'creative', timing: '9:00 AM - 1:00 PM', rating: 8.5, isVerified: true },
    { title: 'Silent Morning Walk at Lalbagh with a Botanist', description: 'Join a retired botanist for a silent guided walk through Lalbagh before the crowds arrive. Learn about rare plant species and the history of this iconic garden.', city: 'bengaluru', type: 'neighborhood-exploration', categories: ['nature', 'walking'], tags: ['botany', 'garden', 'morning'], travelerTypes: ['slow-traveler', 'wellness-seeker', 'photographer'], location: { type: 'Point' as const, coordinates: [77.5855, 12.9507] }, priceRange: 'budget', duration: '2 hours', hostName: 'Dr. Krishna M.', hostContact: 'krishna@example.com', languages: ['English', 'Kannada'], includes: ['Guided walk', 'Plant identification guide', 'Tea'], meetingPoint: 'Lalbagh Main Gate', vibe: 'peaceful', timing: '6:00 AM - 8:00 AM', rating: 9.2, isFeatured: true, isVerified: true },
    { title: 'Traditional Weaving Workshop at Kengeri', description: 'Spend a day with master weavers in Kengeri, learning the art of silk weaving on traditional handlooms. Understand the rich textile heritage of Karnataka.', city: 'bengaluru', type: 'craft-workshop', categories: ['craft', 'culture'], tags: ['weaving', 'textile', 'silk'], travelerTypes: ['cultural-explorer', 'history-lover', 'slow-traveler'], location: { type: 'Point' as const, coordinates: [77.4830, 12.9100] }, priceRange: 'moderate', duration: '5 hours', hostName: 'Shantamma W.', hostContact: 'shantamma@example.com', languages: ['Kannada', 'English'], includes: ['Weaving demo', 'Hands-on experience', 'Fabric sample'], meetingPoint: 'Kengeri Bus Stop', vibe: 'creative', timing: '8:00 AM - 1:00 PM', rating: 8.8, isVerified: true },
    { title: 'Home-Dinner & Storytelling with a Local Chef', description: 'A curated dinner experience in a local home where the chef shares stories behind each dish. From the secret spice blend in the biryani to the history of filter coffee.', city: 'bengaluru', type: 'home-cooked-meal', categories: ['food', 'culture'], tags: ['dinner', 'storytelling', 'biryani'], travelerTypes: ['foodie', 'cultural-explorer', 'slow-traveler'], location: { type: 'Point' as const, coordinates: [77.6100, 12.9700] }, priceRange: 'premium', duration: '3 hours', hostName: 'Meera N.', hostContact: 'meera@example.com', languages: ['English', 'Kannada', 'Hindi'], includes: ['3-course dinner', 'Storytelling', 'Recipe card'], meetingPoint: 'Indiranagar, Bengaluru', vibe: 'peaceful', timing: '7:30 PM - 10:30 PM', rating: 9.8, isFeatured: true, isVerified: true },
    { title: 'Photography Walk Through Bangalore\'s Street Art', description: 'Explore Bengaluru\'s vibrant street art scene with a professional photographer. From Shivajinagar to Malleshwaram, capture the city\'s colorful soul.', city: 'bengaluru', type: 'neighborhood-exploration', categories: ['art', 'walking'], tags: ['photography', 'street-art', 'urban'], travelerTypes: ['photographer', 'slow-traveler', 'cultural-explorer'], location: { type: 'Point' as const, coordinates: [77.5800, 12.9900] }, priceRange: 'budget', duration: '3 hours', hostName: 'Arun P.', hostContact: 'arun@example.com', languages: ['English', 'Kannada', 'Hindi'], includes: ['Photography tips', 'Walking tour', 'Digital image guide'], meetingPoint: 'Shivajinagar Bus Stand', vibe: 'creative', timing: '7:00 AM - 10:00 AM', rating: 8.9, isVerified: true },
    { title: 'Wellness Retreat at an Urban Farm', description: 'Escape the city at an organic urban farm on Bengaluru\'s outskirts. Practice yoga, tend to vegetable beds, and enjoy a farm-to-table lunch.', city: 'bengaluru', type: 'cultural-session', categories: ['wellness', 'nature'], tags: ['yoga', 'farming', 'organic'], travelerTypes: ['wellness-seeker', 'slow-traveler', 'solo-female'], location: { type: 'Point' as const, coordinates: [77.4700, 12.8500] }, priceRange: 'moderate', duration: 'Full day', hostName: 'Lakshmi & Team', hostContact: 'lakshmi@example.com', languages: ['English', 'Kannada'], includes: ['Yoga session', 'Farm tour', 'Farm-to-table lunch'], meetingPoint: 'Electronic City', vibe: 'peaceful', timing: '6:00 AM - 2:00 PM', rating: 9.3, isFeatured: true, isVerified: true },
    { title: 'Kannada Cooking Class in a Traditional Home', description: 'Learn to cook authentic Karnataka dishes like Bisi Bele Bath, Ragi Mudde, and Obbattu with a local grandmother who has been cooking for 50 years.', city: 'bengaluru', type: 'home-cooked-meal', categories: ['food', 'culture'], tags: ['cooking', 'kannada', 'traditional'], travelerTypes: ['foodie', 'cultural-explorer', 'solo-female'], location: { type: 'Point' as const, coordinates: [77.5600, 12.9600] }, priceRange: 'moderate', duration: '4 hours', hostName: 'Saraswathi A.', hostContact: 'saraswathi@example.com', languages: ['Kannada', 'English'], includes: ['Cooking lesson', 'Full meal', 'Spice pack'], meetingPoint: 'Basavanagudi, Bengaluru', vibe: 'peaceful', timing: '10:00 AM - 2:00 PM', rating: 9.4, isVerified: true },
    { title: 'Sunset Drums at Shanti Nagar', description: 'Join a community drum circle that meets every evening at a quiet park in Shanti Nagar. No experience needed — just bring your energy and feel the rhythm.', city: 'bengaluru', type: 'cultural-session', categories: ['music', 'community'], tags: ['drums', 'music', 'sunset'], travelerTypes: ['slow-traveler', 'cultural-explorer', 'solo-female'], location: { type: 'Point' as const, coordinates: [77.5900, 12.9600] }, priceRange: 'free', duration: '1.5 hours', hostName: 'Drum Circle Bengaluru', hostContact: 'drumcircle@example.com', languages: ['English', 'Kannada', 'Hindi'], includes: ['Drums provided', 'Community experience'], meetingPoint: 'Shanti Nagar Park', vibe: 'energetic', timing: '5:30 PM - 7:00 PM', rating: 8.2, isVerified: true },

    // ── Mumbai (10 experiences) ──
    { title: 'Dabbawala Experience: Lunch with Mumbai\'s Lunchbox Heroes', description: 'Follow a real dabbawala on his morning route, learn the legendary coding system, and enjoy a home-cooked meal delivered right to you.', city: 'mumbai', type: 'home-cooked-meal', categories: ['food', 'culture'], tags: ['dabbawala', 'lunchbox', 'iconic'], travelerTypes: ['foodie', 'cultural-explorer', 'photographer'], location: { type: 'Point' as const, coordinates: [72.8777, 19.0760] }, priceRange: 'budget', duration: '4 hours', hostName: 'Suryakant D.', hostContact: 'suryakant@example.com', languages: ['English', 'Hindi', 'Marathi'], includes: ['Behind-the-scenes dabbawala tour', 'Home-cooked lunch', 'Photography guide'], meetingPoint: 'Mumbai Central Station', vibe: 'energetic', timing: '8:00 AM - 12:00 PM', rating: 9.3, isFeatured: true, isVerified: true },
    { title: 'Koli Fishing Village — A Day in the Original Mumbai', description: 'Visit one of Mumbai\'s oldest Koli fishing villages. Watch fishermen return with the catch, learn traditional fish-drying methods, and taste fresh bombil fry.', city: 'mumbai', type: 'village-visit', categories: ['culture', 'food'], tags: ['fishing', 'koli', 'village'], travelerTypes: ['cultural-explorer', 'foodie', 'photographer', 'history-lover'], location: { type: 'Point' as const, coordinates: [72.8310, 19.0400] }, priceRange: 'budget', duration: 'Full day', hostName: 'Rukmini K.', hostContact: 'rukmini@example.com', languages: ['English', 'Marathi', 'Hindi'], includes: ['Village tour', 'Cooking demo', 'Fresh seafood lunch'], meetingPoint: 'Worli Koliwada', vibe: 'peaceful', timing: '6:00 AM - 2:00 PM', rating: 8.8, isVerified: true },
    { title: 'Street Art Walk Through Bhungat & Khotachiwadi', description: 'Explore Mumbai\'s oldest Gaothan (village) neighborhoods with an art historian. See hidden street art, Portuguese-era cottages, and the last remaining green pockets.', city: 'mumbai', type: 'heritage-walk', categories: ['heritage', 'art'], tags: ['street-art', 'heritage', 'village'], travelerTypes: ['history-lover', 'photographer', 'slow-traveler'], location: { type: 'Point' as const, coordinates: [72.8270, 18.9530] }, priceRange: 'budget', duration: '3 hours', hostName: 'Anjali D.', hostContact: 'anjali@example.com', languages: ['English', 'Hindi', 'Marathi'], includes: ['Walking tour', 'Photography tips', 'Local snack'], meetingPoint: 'Bhungat Village Entrance', vibe: 'peaceful', timing: '7:00 AM - 10:00 AM', rating: 9.1, isFeatured: true, isVerified: true },
    { title: 'Irani Café Culture — Breakfast at a 100-Year-Old Café', description: 'Start your day at Mumbai\'s oldest Irani café. Learn about the Parsi community\'s culinary heritage while enjoying bun maska and cutting chai.', city: 'mumbai', type: 'neighborhood-exploration', categories: ['food', 'culture'], tags: ['irani', 'cafe', 'parsi'], travelerTypes: ['foodie', 'history-lover', 'slow-traveler'], location: { type: 'Point' as const, coordinates: [72.8330, 18.9420] }, priceRange: 'budget', duration: '2 hours', hostName: 'Farokh K.', hostContact: 'farokh@example.com', languages: ['English', 'Hindi', 'Gujarati'], includes: ['Breakfast', 'History of Irani cafes', 'Photo walk'], meetingPoint: 'Kyani & Co., Marine Lines', vibe: 'peaceful', timing: '7:00 AM - 9:00 AM', rating: 9.0, isVerified: true },
    { title: 'Dance Like a Bollywood Star — Private Workshop', description: 'Learn iconic Bollywood dance moves from a professional choreographer in a private studio. Fun, energetic, and surprisingly meditative.', city: 'mumbai', type: 'cultural-session', categories: ['dance', 'culture'], tags: ['bollywood', 'dance', 'fun'], travelerTypes: ['cultural-explorer', 'solo-female', 'photographer'], location: { type: 'Point' as const, coordinates: [72.8300, 19.0700] }, priceRange: 'moderate', duration: '2 hours', hostName: 'Priya Dance Studio', hostContact: 'priya@example.com', languages: ['English', 'Hindi'], includes: ['Dance lesson', 'Costume', 'Video recording'], meetingPoint: 'Andheri West, Mumbai', vibe: 'energetic', timing: 'Flexible', rating: 8.7, isVerified: true },
    { title: 'Ferry Ride & Hidden Beaches of the Harbour', description: 'Take a local ferry from the Gateway of India to hidden beaches on the harbour. Swim in secluded coves and enjoy a picnic with home-cooked snacks.', city: 'mumbai', type: 'slow-travel-itinerary', categories: ['nature', 'adventure'], tags: ['ferry', 'beach', 'hidden'], travelerTypes: ['slow-traveler', 'photographer', 'wellness-seeker'], location: { type: 'Point' as const, coordinates: [72.8350, 18.9220] }, priceRange: 'budget', duration: '5 hours', hostName: 'Coastal Collective', hostContact: 'coastal@example.com', languages: ['English', 'Hindi', 'Marathi'], includes: ['Ferry tickets', 'Picnic lunch', 'Snorkeling gear'], meetingPoint: 'Gateway of India', vibe: 'peaceful', timing: '8:00 AM - 1:00 PM', rating: 9.2, isFeatured: true, isVerified: true },
    { title: 'Parsi Home Dinner — A Taste of Ancient Persia', description: 'Enjoy a traditional Parsi dinner in a family home in South Mumbai. From Dhansak to Patra ni Machhi, every dish has a story.', city: 'mumbai', type: 'home-cooked-meal', categories: ['food', 'culture'], tags: ['parsi', 'dinner', 'family'], travelerTypes: ['foodie', 'cultural-explorer', 'history-lover'], location: { type: 'Point' as const, coordinates: [72.8250, 18.9600] }, priceRange: 'premium', duration: '3 hours', hostName: 'Dolly T.', hostContact: 'dolly@example.com', languages: ['English', 'Hindi', 'Gujarati'], includes: ['Traditional Parsi dinner', 'Home tour', 'Recipe book'], meetingPoint: 'Colaba, Mumbai', vibe: 'peaceful', timing: '7:30 PM - 10:30 PM', rating: 9.6, isFeatured: true, isVerified: true },
    { title: 'Morning Walk at Marine Drive with a Local', description: 'Not your usual tourist walk. A local Mumbaikar will share stories of the Queen\'s Necklace, the art deco buildings, and the city\'s relationship with the sea.', city: 'mumbai', type: 'heritage-walk', categories: ['heritage', 'walking'], tags: ['art-deco', 'marine-drive', 'sunrise'], travelerTypes: ['slow-traveler', 'photographer', 'history-lover'], location: { type: 'Point' as const, coordinates: [72.8200, 18.9440] }, priceRange: 'free', duration: '1.5 hours', hostName: 'Rohan F.', hostContact: 'rohan@example.com', languages: ['English', 'Hindi', 'Marathi'], includes: ['Guided walk', 'Art deco guide', 'Chai'], meetingPoint: 'Marine Drive, near Churchgate', vibe: 'peaceful', timing: '6:00 AM - 7:30 AM', rating: 8.9, isVerified: true },
    { title: 'Pottery Workshop in the Parsi Colony', description: 'Learn pottery in a charming Parsi colony compound. The workshop is held in a beautiful old bungalow surrounded by mango trees.', city: 'mumbai', type: 'craft-workshop', categories: ['craft', 'art'], tags: ['pottery', 'parsi-colony', 'creative'], travelerTypes: ['cultural-explorer', 'wellness-seeker', 'slow-traveler'], location: { type: 'Point' as const, coordinates: [72.8400, 19.0100] }, priceRange: 'moderate', duration: '3 hours', hostName: 'Rustom\'s Pottery', hostContact: 'rustom@example.com', languages: ['English', 'Hindi'], includes: ['Materials', 'Firing', 'Refreshments'], meetingPoint: 'Dadar Parsi Colony', vibe: 'creative', timing: '10:00 AM - 1:00 PM', rating: 8.6, isVerified: true },
    { title: 'Sunset at Haji Ali — A Spiritual Walk', description: 'Walk to the Haji Ali Dargah during low tide at sunset. A local storyteller shares the legend of Haji Ali and the spiritual history of the sea.', city: 'mumbai', type: 'neighborhood-exploration', categories: ['spiritual', 'culture'], tags: ['haji-ali', 'sunset', 'spiritual'], travelerTypes: ['slow-traveler', 'cultural-explorer', 'photographer'], location: { type: 'Point' as const, coordinates: [72.8100, 18.9820] }, priceRange: 'free', duration: '2 hours', hostName: 'Siddharth R.', hostContact: 'siddharth@example.com', languages: ['English', 'Hindi', 'Marathi'], includes: ['Spiritual walk', 'Storytelling', 'Tea'], meetingPoint: 'Haji Ali Circle', vibe: 'peaceful', timing: '5:00 PM - 7:00 PM', rating: 9.0, isVerified: true },

    // ── Jaipur (10 experiences) ──
    { title: 'Block Printing Workshop in Sanganer', description: 'Learn the ancient art of hand-block printing from master craftsmen in Sanganer village. Create your own fabric to take home.', city: 'jaipur', type: 'craft-workshop', categories: ['craft', 'art'], tags: ['block-printing', 'textile', 'sanganer'], travelerTypes: ['cultural-explorer', 'photographer', 'slow-traveler'], location: { type: 'Point' as const, coordinates: [75.7780, 26.8120] }, priceRange: 'moderate', duration: '3 hours', hostName: 'Mohan C.', hostContact: 'mohanchippa@example.com', languages: ['English', 'Hindi'], includes: ['Materials', 'Tea', 'Your printed fabric'], meetingPoint: 'Sanganer Village', vibe: 'creative', timing: '10:00 AM - 1:00 PM', rating: 9.2, isVerified: true },
    { title: 'Sunrise Yoga at Nahargarh Fort', description: 'Practice yoga as the sun rises over the Pink City, overlooking Jaipur from the ancient fort ramparts.', city: 'jaipur', type: 'cultural-session', categories: ['wellness', 'heritage'], tags: ['yoga', 'sunrise', 'fort'], travelerTypes: ['wellness-seeker', 'photographer', 'solo-female'], location: { type: 'Point' as const, coordinates: [75.8152, 26.9387] }, priceRange: 'moderate', duration: '2 hours', hostName: 'Neha R.', hostContact: 'neha@example.com', languages: ['English', 'Hindi'], includes: ['Yoga session', 'Water', 'Fort entry fee'], meetingPoint: 'Nahargarh Fort Entrance', vibe: 'peaceful', timing: '5:30 AM - 7:30 AM', rating: 9.5, isFeatured: true, isVerified: true },
    { title: 'Rajasthani Home Dinner with a Noble Family', description: 'Dine in a 200-year-old haveli with a family that has lived in Jaipur for 12 generations. Experience authentic Rajasthani cuisine and hear tales of the Pink City\'s royal past.', city: 'jaipur', type: 'home-cooked-meal', categories: ['food', 'heritage'], tags: ['rajasthani', 'haveli', 'royal'], travelerTypes: ['foodie', 'history-lover', 'cultural-explorer'], location: { type: 'Point' as const, coordinates: [75.8200, 26.9100] }, priceRange: 'premium', duration: '3.5 hours', hostName: 'Rani Sahiba', hostContact: 'rani@example.com', languages: ['English', 'Hindi', 'Rajasthani'], includes: ['Traditional dinner', 'Haveli tour', 'Dessert demo'], meetingPoint: 'Walled City, Jaipur', vibe: 'peaceful', timing: '7:00 PM - 10:30 PM', rating: 9.7, isFeatured: true, isVerified: true },
    { title: 'Blue Pottery Workshop with a Master Artisan', description: 'Learn the centuries-old art of Jaipur\'s famous blue pottery. Make your own plate or vase under the guidance of a national award-winning artisan.', city: 'jaipur', type: 'craft-workshop', categories: ['craft', 'art'], tags: ['blue-pottery', 'ceramic', 'masterclass'], travelerTypes: ['cultural-explorer', 'slow-traveler', 'photographer'], location: { type: 'Point' as const, coordinates: [75.8300, 26.8900] }, priceRange: 'moderate', duration: '3 hours', hostName: 'Kripal S.', hostContact: 'kripal@example.com', languages: ['English', 'Hindi'], includes: ['Materials', 'Firing', 'Your piece shipped home'], meetingPoint: 'Blue Pottery Studio, Amer Road', vibe: 'creative', timing: '11:00 AM - 2:00 PM', rating: 9.3, isFeatured: true, isVerified: true },
    { title: 'Heritage Walk Through the Walled City', description: 'Walk through the gates of the Pink City with a historian. Discover hidden stepwells, ancient temples, and bazaars that have operated for 300 years.', city: 'jaipur', type: 'heritage-walk', categories: ['heritage', 'walking'], tags: ['walled-city', 'stepwells', 'bazaar'], travelerTypes: ['history-lover', 'photographer', 'slow-traveler'], location: { type: 'Point' as const, coordinates: [75.8280, 26.9170] }, priceRange: 'budget', duration: '3 hours', hostName: 'Vijay S.', hostContact: 'vijay@example.com', languages: ['English', 'Hindi'], includes: ['Walking tour', 'Chai at a hidden stall', 'Photo guide'], meetingPoint: 'Chandpole Gate', vibe: 'peaceful', timing: '6:30 AM - 9:30 AM', rating: 9.0, isVerified: true },
    { title: 'Village Safari — Life Beyond the Pink City', description: 'Visit a traditional Rajasthani village 20km from Jaipur. See camel cart rides, meet rural artisans, and enjoy a lunch cooked in a clay oven.', city: 'jaipur', type: 'village-visit', categories: ['culture', 'nature'], tags: ['village', 'rural', 'rajasthan'], travelerTypes: ['cultural-explorer', 'photographer', 'slow-traveler'], location: { type: 'Point' as const, coordinates: [75.7000, 26.7500] }, priceRange: 'moderate', duration: 'Full day', hostName: 'Bhanwar M.', hostContact: 'bhanwar@example.com', languages: ['Hindi', 'English', 'Rajasthani'], includes: ['Village tour', 'Camel ride', 'Rural lunch'], meetingPoint: 'Jaipur Bus Stand', vibe: 'peaceful', timing: '8:00 AM - 4:00 PM', rating: 9.1, isFeatured: true, isVerified: true },
    { title: 'Turban Tying & Rajasthani Folk Music Evening', description: 'Learn the art of tying a Rajasthani turban (pagdi), then enjoy an evening of folk music and puppet show in a traditional setting.', city: 'jaipur', type: 'cultural-session', categories: ['culture', 'music'], tags: ['turban', 'folk-music', 'puppet'], travelerTypes: ['cultural-explorer', 'photographer', 'solo-female'], location: { type: 'Point' as const, coordinates: [75.8400, 26.9000] }, priceRange: 'moderate', duration: '3 hours', hostName: 'Bhagwan D.', hostContact: 'bhagwan@example.com', languages: ['English', 'Hindi'], includes: ['Turban demo', 'Folk performance', 'Dinner'], meetingPoint: 'Choki Dhani, Jaipur', vibe: 'energetic', timing: '5:00 PM - 8:00 PM', rating: 8.8, isVerified: true },
    { title: 'Street Food Walk — From Lassi to Laal Maas', description: 'Navigate Jaipur\'s legendary street food scene with a local foodie. Taste pyaaz kachori, ghewar, laal maas, and the best lassi in town.', city: 'jaipur', type: 'neighborhood-exploration', categories: ['food', 'culture'], tags: ['street-food', 'lassi', 'kachori'], travelerTypes: ['foodie', 'photographer', 'slow-traveler'], location: { type: 'Point' as const, coordinates: [75.8270, 26.9150] }, priceRange: 'budget', duration: '3 hours', hostName: 'Kavita G.', hostContact: 'kavita@example.com', languages: ['English', 'Hindi'], includes: ['Food tasting (10+ items)', 'Walking tour', 'Food map'], meetingPoint: 'Johari Bazaar, Jaipur', vibe: 'energetic', timing: '4:00 PM - 7:00 PM', rating: 9.4, isFeatured: true, isVerified: true },
    { title: 'Sunset at Nahargarh — A Photographer\'s Dream', description: 'Visit Nahargarh Fort at golden hour with a professional photographer who knows every angle. Capture the Pink City in its best light.', city: 'jaipur', type: 'neighborhood-exploration', categories: ['photography', 'heritage'], tags: ['photography', 'sunset', 'fort'], travelerTypes: ['photographer', 'slow-traveler', 'solo-female'], location: { type: 'Point' as const, coordinates: [75.8152, 26.9387] }, priceRange: 'budget', duration: '2.5 hours', hostName: 'Arjun G.', hostContact: 'arjun@example.com', languages: ['English', 'Hindi'], includes: ['Photography guidance', 'Fort entry', 'Water'], meetingPoint: 'Nahargarh Fort Parking', vibe: 'peaceful', timing: '4:30 PM - 7:00 PM', rating: 9.0, isVerified: true },
    { title: 'Gemstone Cutting & Jewellery Craft Workshop', description: 'Jaipur is India\'s gemstone capital. Visit a family-run workshop to see how rough stones become sparkling gems, and try your hand at basic cutting.', city: 'jaipur', type: 'craft-workshop', categories: ['craft', 'heritage'], tags: ['gemstone', 'jewellery', 'craft'], travelerTypes: ['cultural-explorer', 'history-lover', 'photographer'], location: { type: 'Point' as const, coordinates: [75.8250, 26.9100] }, priceRange: 'moderate', duration: '2 hours', hostName: 'Rajesh G.', hostContact: 'rajesh@example.com', languages: ['English', 'Hindi'], includes: ['Workshop tour', 'Gem identification guide', 'Small gemstone gift'], meetingPoint: 'Johari Bazaar, Jaipur', vibe: 'creative', timing: '10:00 AM - 12:00 PM', rating: 8.5, isVerified: true },

    // ── Udaipur (9 experiences) ──
    { title: 'Sunset Boat Ride on Lake Pichola', description: 'Sail on Lake Pichola at sunset on a traditional boat. Watch the City Palace and Lake Palace glow gold as the sun sets behind the Aravalli hills.', city: 'udaipur', type: 'cultural-session', categories: ['nature', 'heritage'], tags: ['lake', 'sunset', 'boat'], travelerTypes: ['slow-traveler', 'photographer', 'wellness-seeker'], location: { type: 'Point' as const, coordinates: [73.6800, 24.5700] }, priceRange: 'moderate', duration: '1.5 hours', hostName: 'Pichola Boating Co-op', hostContact: 'picholaboat@example.com', languages: ['English', 'Hindi', 'Mewari'], includes: ['Boat ride', 'Life jacket', 'Evening tea'], meetingPoint: 'Lake Pichola Ghat', vibe: 'peaceful', timing: '5:00 PM - 6:30 PM', rating: 9.6, isFeatured: true, isVerified: true },
    { title: 'Mewari Home Dinner in a Heritage Haveli', description: 'Dine in a 300-year-old haveli overlooking the lake. The host family shares stories of Udaipur\'s royal history while serving traditional Mewari cuisine.', city: 'udaipur', type: 'home-cooked-meal', categories: ['food', 'heritage'], tags: ['mewari', 'haveli', 'royal'], travelerTypes: ['foodie', 'history-lover', 'cultural-explorer'], location: { type: 'Point' as const, coordinates: [73.6830, 24.5750] }, priceRange: 'premium', duration: '3 hours', hostName: 'Shivranjani Devi', hostContact: 'shivranjani@example.com', languages: ['English', 'Hindi', 'Mewari'], includes: ['Traditional dinner', 'Haveli tour', 'Family stories'], meetingPoint: 'Old City, Udaipur', vibe: 'peaceful', timing: '7:30 PM - 10:30 PM', rating: 9.8, isFeatured: true, isVerified: true },
    { title: 'Miniature Painting Workshop', description: 'Learn the delicate art of Mewar miniature painting from a master artist. Paint your own piece using traditional natural colors and fine brushes.', city: 'udaipur', type: 'craft-workshop', categories: ['craft', 'art'], tags: ['miniature', 'painting', 'mewar'], travelerTypes: ['cultural-explorer', 'slow-traveler', 'photographer'], location: { type: 'Point' as const, coordinates: [73.6850, 24.5800] }, priceRange: 'moderate', duration: '3 hours', hostName: 'Gopal J.', hostContact: 'gopal@example.com', languages: ['English', 'Hindi'], includes: ['Materials', 'Tea', 'Your painting framed'], meetingPoint: 'Near Jagdish Temple', vibe: 'creative', timing: '10:00 AM - 1:00 PM', rating: 9.3, isVerified: true },
    { title: 'Heritage Walk Through Udaipur\'s Old City', description: 'Walk through the narrow lanes of Udaipur\'s old city with a local historian. Visit hidden temples, stepwells, and the oldest bazaar in the city.', city: 'udaipur', type: 'heritage-walk', categories: ['heritage', 'walking'], tags: ['old-city', 'bazaar', 'temples'], travelerTypes: ['history-lover', 'photographer', 'slow-traveler'], location: { type: 'Point' as const, coordinates: [73.6820, 24.5770] }, priceRange: 'budget', duration: '3 hours', hostName: 'Mohan S.', hostContact: 'mohan@example.com', languages: ['English', 'Hindi', 'Mewari'], includes: ['Walking tour', 'Local snack', 'Heritage map'], meetingPoint: 'Badi Pol, City Palace', vibe: 'peaceful', timing: '6:30 AM - 9:30 AM', rating: 8.9, isVerified: true },
    { title: 'Organic Farm Visit & Cooking in the Hills', description: 'Drive to an organic farm in the Aravalli hills outside Udaipur. Pick vegetables, cook a meal in a clay oven, and eat overlooking the valley.', city: 'udaipur', type: 'village-visit', categories: ['nature', 'food'], tags: ['organic', 'farming', 'hills'], travelerTypes: ['wellness-seeker', 'foodie', 'slow-traveler'], location: { type: 'Point' as const, coordinates: [73.5500, 24.6200] }, priceRange: 'moderate', duration: '5 hours', hostName: 'Lakshmi D.', hostContact: 'lakshmi@example.com', languages: ['English', 'Hindi', 'Mewari'], includes: ['Farm tour', 'Cooking class', 'Farm lunch'], meetingPoint: 'Udaipur Bus Stand', vibe: 'peaceful', timing: '8:00 AM - 1:00 PM', rating: 9.2, isFeatured: true, isVerified: true },
    { title: 'Sunrise Yoga at Jagmandir Island', description: 'Take a boat to Jagmandir Island in Lake Pichola for a sunrise yoga session. The view of the City Palace from the water is unmatched.', city: 'udaipur', type: 'cultural-session', categories: ['wellness', 'nature'], tags: ['yoga', 'island', 'sunrise'], travelerTypes: ['wellness-seeker', 'solo-female', 'photographer'], location: { type: 'Point' as const, coordinates: [73.6780, 24.5650] }, priceRange: 'premium', duration: '2 hours', hostName: 'Ananda Wellness', hostContact: 'ananda@example.com', languages: ['English', 'Hindi'], includes: ['Boat transfer', 'Yoga session', 'Herbal tea'], meetingPoint: 'Jagmandir Jetty', vibe: 'peaceful', timing: '5:30 AM - 7:30 AM', rating: 9.7, isFeatured: true, isVerified: true },
    { title: 'Silver Jewellery Making Workshop', description: 'Udaipur is known for its silverwork. Learn basic silversmithing techniques and make your own ring or pendant with a local artisan.', city: 'udaipur', type: 'craft-workshop', categories: ['craft', 'art'], tags: ['silver', 'jewellery', 'artisan'], travelerTypes: ['cultural-explorer', 'solo-female', 'slow-traveler'], location: { type: 'Point' as const, coordinates: [73.6840, 24.5760] }, priceRange: 'moderate', duration: '4 hours', hostName: 'Ratan S.', hostContact: 'ratan@example.com', languages: ['English', 'Hindi'], includes: ['Materials (silver)', 'Tools', 'Your creation'], meetingPoint: 'Clock Tower, Udaipur', vibe: 'creative', timing: '10:00 AM - 2:00 PM', rating: 8.7, isVerified: true },
    { title: 'Neighborhood Exploration — A Day in Old Bhilwara', description: 'Spend a day in the charming neighborhood of Bhilwara, known for its stepwells, havelis, and the most authentic dal baati churma in Udaipur.', city: 'udaipur', type: 'neighborhood-exploration', categories: ['culture', 'food'], tags: ['bhilwara', 'stepwells', 'dal-baati'], travelerTypes: ['foodie', 'history-lover', 'photographer'], location: { type: 'Point' as const, coordinates: [73.6900, 24.5850] }, priceRange: 'budget', duration: '4 hours', hostName: 'Deepak S.', hostContact: 'deepak@example.com', languages: ['English', 'Hindi', 'Mewari'], includes: ['Walking tour', 'Lunch at a local home', 'Photo walk'], meetingPoint: 'Clock Tower, Udaipur', vibe: 'peaceful', timing: '9:00 AM - 1:00 PM', rating: 8.6, isVerified: true },
    { title: 'Traditional Rajasthani Folk Evening at Bagore-ki-Haveli', description: 'Experience authentic Rajasthani folk music, puppet shows, and traditional dance performances at the beautiful Bagore-ki-Haveli museum.', city: 'udaipur', type: 'cultural-session', categories: ['culture', 'music'], tags: ['folk', 'dance', 'museum'], travelerTypes: ['cultural-explorer', 'photographer', 'history-lover'], location: { type: 'Point' as const, coordinates: [73.6820, 24.5740] }, priceRange: 'budget', duration: '2 hours', hostName: 'Bagore-ki-Haveli', hostContact: 'bagore@example.com', languages: ['English', 'Hindi'], includes: ['Performance', 'Museum entry'], meetingPoint: 'Bagore-ki-Haveli, Gangaur Ghat', vibe: 'energetic', timing: '7:00 PM - 9:00 PM', rating: 8.8, isVerified: true },

    // ── Delhi (carried over) ──
    { title: 'Old Delhi Food Walk — Beyond the Tourist Trail', description: 'Navigate the narrow galis of Chandni Chowk with a local foodie. Taste the best parathas, jalebis, and nihari at hidden gems no tourist knows about.', city: 'delhi', type: 'neighborhood-exploration', categories: ['food', 'culture'], tags: ['street-food', 'old-delhi', 'chandni-chowk'], travelerTypes: ['foodie', 'photographer', 'slow-traveler'], location: { type: 'Point' as const, coordinates: [77.2310, 28.6560] }, priceRange: 'budget', duration: '4 hours', hostName: 'Zafar A.', hostContact: 'zafar@example.com', languages: ['English', 'Hindi', 'Urdu'], includes: ['Food tasting (8+ items)', 'Rickshaw ride', 'Digital food map'], meetingPoint: 'Chandni Chowk Metro Station', vibe: 'energetic', timing: '8:00 AM - 12:00 PM', rating: 9.0, isVerified: true },
    { title: 'Meditation at the Lotus Temple with a Local Guide', description: 'Experience the peace of the Lotus Temple before it opens to the public. A local volunteer will guide you through a meditation session in the silent halls.', city: 'delhi', type: 'cultural-session', categories: ['spiritual', 'wellness'], tags: ['meditation', 'lotus-temple', 'peace'], travelerTypes: ['wellness-seeker', 'slow-traveler', 'solo-female'], location: { type: 'Point' as const, coordinates: [77.2588, 28.5535] }, priceRange: 'free', duration: '2 hours', hostName: 'Ananya S.', hostContact: 'ananya@example.com', languages: ['English', 'Hindi'], includes: ['Early access', 'Guided meditation', 'Tea'], meetingPoint: 'Lotus Temple Main Gate', vibe: 'peaceful', timing: '6:00 AM - 8:00 AM', rating: 9.7, isFeatured: true, isVerified: true },

    // ── Kochi (carried over) ──
    { title: 'Spice Garden Visit & Traditional Kerala Cooking', description: 'Walk through a family-owned spice garden, pick fresh spices, then learn to make an authentic Kerala sadya (feast) with a local matriarch.', city: 'kochi', type: 'home-cooked-meal', categories: ['food', 'culture'], tags: ['spices', 'kerala', 'sadya'], travelerTypes: ['foodie', 'cultural-explorer', 'slow-traveler'], location: { type: 'Point' as const, coordinates: [76.3100, 10.0100] }, priceRange: 'moderate', duration: '5 hours', hostName: 'Molly K.', hostContact: 'molly@example.com', languages: ['English', 'Malayalam', 'Hindi'], includes: ['Spice garden tour', 'Cooking class', 'Traditional lunch on banana leaf', 'Spice pack to take home'], meetingPoint: 'Fort Kochi', vibe: 'peaceful', timing: '9:00 AM - 2:00 PM', rating: 9.6, isFeatured: true, isVerified: true },
    { title: 'Chinese Fishing Nets — Stories of the Coast', description: 'Join a local fisherman at dawn to operate the iconic Chinese fishing nets. Hear stories of Kochi\'s coastal heritage as the sun rises over the Arabian Sea.', city: 'kochi', type: 'cultural-session', categories: ['culture', 'heritage'], tags: ['fishing-nets', 'dawn', 'coastal'], travelerTypes: ['photographer', 'history-lover', 'slow-traveler'], location: { type: 'Point' as const, coordinates: [76.2427, 9.9656] }, priceRange: 'budget', duration: '2.5 hours', hostName: 'Baburaj P.', hostContact: 'baburaj@example.com', languages: ['English', 'Malayalam'], includes: ['Fishing net demonstration', 'Early morning tea', 'Photography tips'], meetingPoint: 'Fort Kochi Beach', vibe: 'peaceful', timing: '5:30 AM - 8:00 AM', rating: 8.7, isVerified: true },

    // ── Varanasi (carried over) ──
    { title: 'Silent Boat Ride on the Ganges at Dawn', description: 'Experience the magic of Varanasi from the water. A silent boat ride through the misty Ganges at sunrise, watching the ghats come to life.', city: 'varanasi', type: 'cultural-session', categories: ['spiritual', 'nature'], tags: ['ganges', 'boat', 'sunrise'], travelerTypes: ['slow-traveler', 'photographer', 'wellness-seeker', 'solo-female'], location: { type: 'Point' as const, coordinates: [82.9912, 25.3176] }, priceRange: 'budget', duration: '2 hours', hostName: 'Gautam N.', hostContact: 'gautam@example.com', languages: ['English', 'Hindi'], includes: ['Boat ride', 'Chai', 'Life jacket'], meetingPoint: 'Dasashwamedh Ghat', vibe: 'peaceful', timing: '5:00 AM - 7:00 AM', rating: 9.8, isFeatured: true, isVerified: true },
    { title: 'Silk Weaving Village Visit', description: 'Travel to a village near Varanasi where families have woven Banarasi silk for centuries. Watch the looms, meet the weavers, and learn the craft.', city: 'varanasi', type: 'village-visit', categories: ['craft', 'culture'], tags: ['silk', 'weaving', 'varanasi'], travelerTypes: ['cultural-explorer', 'photographer', 'history-lover'], location: { type: 'Point' as const, coordinates: [82.9500, 25.3000] }, priceRange: 'moderate', duration: 'Half day', hostName: 'Shyam W.', hostContact: 'shyam@example.com', languages: ['English', 'Hindi'], includes: ['Village tour', 'Weaving demonstration', 'Chai with a weaver family'], meetingPoint: 'Varanasi Cantonment', vibe: 'peaceful', timing: '8:00 AM - 1:00 PM', rating: 9.0, isVerified: true },

    // ── Kolkata (carried over) ──
    { title: 'Tram Ride & North Kolkata Neighborhood Walk', description: 'Experience Old Kolkata by tram followed by a walk through the narrow lanes of North Kolkata. Visit hidden temples, old bookshops, and a century-old sweet shop.', city: 'kolkata', type: 'neighborhood-exploration', categories: ['heritage', 'food'], tags: ['tram', 'kolkata', 'heritage'], travelerTypes: ['slow-traveler', 'history-lover', 'photographer'], location: { type: 'Point' as const, coordinates: [88.3639, 22.5726] }, priceRange: 'budget', duration: '3 hours', hostName: 'Arunima D.', hostContact: 'arunima@example.com', languages: ['English', 'Bengali', 'Hindi'], includes: ['Tram ticket', 'Walking tour', 'Bengali sweet tasting'], meetingPoint: 'Esplanade Tram Depot', vibe: 'peaceful', timing: '7:00 AM - 10:00 AM', rating: 9.1, isVerified: true },

    // ── Chennai (carried over) ──
    { title: 'Morning at Marina — A Fisherfolk\'s Tale', description: 'Join a fisherwoman at the iconic Marina Beach at dawn. Learn about the fishing traditions, watch the boats launch, and taste freshly caught fish fry.', city: 'chennai', type: 'cultural-session', categories: ['culture', 'food'], tags: ['marina', 'fishing', 'tamil'], travelerTypes: ['cultural-explorer', 'foodie', 'photographer'], location: { type: 'Point' as const, coordinates: [80.2830, 13.0580] }, priceRange: 'budget', duration: '2 hours', hostName: 'Meenakshi R.', hostContact: 'meenakshi@example.com', languages: ['English', 'Tamil'], includes: ['Beach walk', 'Fish fry tasting', 'Stories of the sea'], meetingPoint: 'Marina Beach Lighthouse', vibe: 'peaceful', timing: '5:30 AM - 7:30 AM', rating: 8.5, isVerified: true },
];

// ─── Curated Guides Data ────────────────────────────────────
const guidesData = [
    {
        title: 'First Time in Bengaluru',
        city: 'bengaluru', slug: 'first-time-bengaluru',
        overview: 'A handpicked guide for first-time visitors to Bengaluru. Experience the city beyond the IT parks — from serene lakes to heritage cafés and local art scenes.',
        travelerType: 'slow-traveler',
        duration: '2-3 days',
        sections: [
            { title: 'Morning Peace', content: 'Start your day at Cubbon Park. Walk among the Banyan trees, watch the morning walkers, and grab coffee at the iconic Indian Coffee House right outside.', spots: [], experiences: [] },
            { title: 'Authentic Experiences', content: 'Don\'t just visit — experience. Book a home-cooked meal with a local family or walk through Malleshwaram with a storyteller.', spots: [], experiences: [] },
            { title: 'Sunset & Reflection', content: 'End your day at Sankey Tank. The sunset light on the water is magical, and the walking path is perfect for quiet reflection.', spots: [], experiences: [] },
        ],
        isPublished: true,
    },
    {
        title: 'First Time in Mumbai',
        city: 'mumbai', slug: 'first-time-mumbai',
        overview: 'Discover Mumbai beyond Bollywood and skyscrapers. This guide takes you to the city\'s hidden soul — its fishing villages, street food secrets, and quiet seaside corners.',
        travelerType: 'cultural-explorer',
        duration: '2-3 days',
        sections: [
            { title: 'The Original Mumbai', content: 'Start in the Koli fishing village of Worli. See how Mumbai lived before the highrises, and taste the freshest seafood you\'ll ever have.', spots: [], experiences: [] },
            { title: 'Lunch with Legends', content: 'Join a dabbawala on his route. This is not a tourist show — it\'s a genuine look at one of the world\'s most remarkable logistics systems, followed by a home-cooked meal.', spots: [], experiences: [] },
            { title: 'Coastal Calm', content: 'End at Bandstand Promenade at sunset. The sea breeze, the Sea Link lights, and the sound of waves is the perfect Mumbai farewell.', spots: [], experiences: [] },
        ],
        isPublished: true,
    },
    {
        title: 'First Time in Jaipur',
        city: 'jaipur', slug: 'first-time-jaipur',
        overview: 'Jaipur is more than its forts and palaces. This guide helps you experience the Pink City through its crafts, food, and quiet sunrise moments.',
        travelerType: 'photographer',
        duration: '2 days',
        sections: [
            { title: 'Sunrise from the Fort', content: 'Start with yoga at Nahargarh Fort as the sun paints the Pink City gold. The views are unbeatable, and the morning peace is transformative.', spots: [], experiences: [] },
            { title: 'Craft & Culture', content: 'Head to Sanganer village for a block-printing workshop. Watch master craftsmen at work and create your own souvenir.', spots: [], experiences: [] },
            { title: 'Evening at Nahargarh', content: 'Return to Nahargarh for sunset. Stay for the twinkling city lights — it\'s a view you\'ll carry forever.', spots: [], experiences: [] },
        ],
        isPublished: true,
    },
    {
        title: 'First Time in Kochi',
        city: 'kochi', slug: 'first-time-kochi',
        overview: 'Kochi is where the backwaters meet the Arabian Sea, and history meets tranquility. This guide shows you the soul of the Queen of the Arabian Sea.',
        travelerType: 'foodie',
        duration: '2-3 days',
        sections: [
            { title: 'Spice & Soul', content: 'Start with a spice garden visit and traditional Kerala cooking class. Learn why Kerala is called the Spice Coast of India.', spots: [], experiences: [] },
            { title: 'Fishing Nets & Stories', content: 'Visit the Chinese fishing nets at dawn. Watch the fishermen at work and hear their stories of the sea.', spots: [], experiences: [] },
            { title: 'Fort Kochi Walk', content: 'Explore the streets of Fort Kochi — colonial architecture, art galleries, and the quiet charm of a city that has welcomed traders for centuries.', spots: [], experiences: [] },
        ],
        isPublished: true,
    },
];

// ─── Local Stories Data ──────────────────────────────────────
const storiesData = [
    { title: 'The Old Man Who Planted Banyans', content: 'I met a retired professor who has planted over 200 trees in Cubbon Park over the last 30 years. He knows every path by heart, every bird by call. "This park is my temple," he said, as he watered a sapling. I sat with him for an hour. He didn\'t ask my name, but he gave me hope.', tags: ['nature', 'people', 'bengaluru'], isApproved: true },
    { title: 'Learning to Cook with Grandma', content: 'I booked a home-cooked meal experience not knowing what to expect. I didn\'t just eat — I learned. The grandmother who hosted me taught me how to temper spices, how to tell if a dosa is ready, and how food is love made edible. I cried when I left.', tags: ['food', 'culture', 'home-cooking'], isApproved: true },
    { title: 'The Quietest Hour in Varanasi', content: 'Everyone told me Varanasi is chaotic. They\'re right — until 5 AM. The silent boat ride at dawn changed how I understand peace. No chants, no bells, just the oars dipping into the Ganges and the sun rising over the ghats. That hour was worth the entire trip.', tags: ['spiritual', 'solitude', 'varanasi'], isApproved: true },
    { title: 'Chai with a Dabbawala', content: 'I spent a morning with a dabbawala named Prakash. He\'s been delivering lunches for 27 years, never once missed a delivery. His secret? "We don\'t carry food — we carry love from wives to husbands, mothers to sons." Mumbai runs on love, not trains.', tags: ['mumbai', 'people', 'food'], isApproved: true },
    { title: 'Block Print Magic in Sanganer', content: 'Watching a block printer work is like watching a musician play. The rhythm, the precision, the centuries of knowledge in their hands. I tried and failed hilariously. My host laughed and said, "It took my grandfather 10 years to learn. Come back tomorrow."', tags: ['craft', 'jaipur', 'artisans'], isApproved: true },
    { title: 'Finding Stillness in Fort Kochi', content: 'I sat at Fort Kochi beach for three hours watching the Chinese fishing nets. They haven\'t changed in 500 years. The fishermen haven\'t either. In a world obsessed with speed, these nets move at the pace of the tide. That\'s the real luxury.', tags: ['kochi', 'stillness', 'slow-living'], isApproved: true },
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
            Experience.deleteMany({}),
            LocalStory.deleteMany({}),
            CuratedGuide.deleteMany({}),
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
            images: getSpotImages(spot.categories),
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

        // Create Experiences
        const experiencesWithCities = experiencesData.map((exp) => ({
            ...exp,
            city: cityMap.get(exp.city),
            submittedBy: admin._id,
        }));
        const experiences = await Experience.insertMany(experiencesWithCities);
        console.log(`🎭 ${experiences.length} authentic experiences created`);

        // Create Curated Guides (must be done after spots/experiences exist)
        const guidesWithCities = guidesData.map((guide) => ({
            ...guide,
            city: cityMap.get(guide.city),
        }));
        const guides = await CuratedGuide.insertMany(guidesWithCities);
        console.log(`📖 ${guides.length} curated guides created`);

        // Create Local Stories
        const storiesWithAuthors = storiesData.map((story) => ({
            ...story,
            author: admin._id,
            authorName: 'Admin',
            city: cityMap.get('bengaluru'),
        }));
        const stories = await LocalStory.insertMany(storiesWithAuthors);
        console.log(`📝 ${stories.length} local stories created`);

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
