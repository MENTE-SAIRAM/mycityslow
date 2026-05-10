import mongoose, { Document, Schema, Types } from 'mongoose';

export type ExperienceType = 'home-cooked-meal' | 'heritage-walk' | 'craft-workshop' | 'village-visit' | 'cultural-session' | 'slow-travel-itinerary' | 'neighborhood-exploration';

export type TravelerType = 'slow-traveler' | 'cultural-explorer' | 'foodie' | 'photographer' | 'wellness-seeker' | 'solo-female' | 'history-lover';

export interface IExperience extends Document {
    title: string;
    description: string;
    type: ExperienceType;
    categories: string[];
    tags: string[];
    travelerTypes: TravelerType[];
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    city: Types.ObjectId;
    address: string;
    images: string[];
    priceRange: 'free' | 'budget' | 'moderate' | 'premium';
    duration: string;
    hostName: string;
    hostContact: string;
    languages: string[];
    includes: string[];
    meetingPoint: string;
    vibe: string;
    timing: string;
    isVerified: boolean;
    isFeatured: boolean;
    submittedBy?: Types.ObjectId;
    rating: number;
    bestTime: string;
    crowdLevel: string;
    createdAt: Date;
    updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        type: {
            type: String,
            enum: ['home-cooked-meal', 'heritage-walk', 'craft-workshop', 'village-visit', 'cultural-session', 'slow-travel-itinerary', 'neighborhood-exploration'],
            required: true,
        },
        categories: [{ type: String }],
        tags: [{ type: String }],
        travelerTypes: [{ type: String, enum: ['slow-traveler', 'cultural-explorer', 'foodie', 'photographer', 'wellness-seeker', 'solo-female', 'history-lover'] }],
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], required: true },
        },
        city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
        address: { type: String, default: '' },
        images: [{ type: String }],
        priceRange: { type: String, enum: ['free', 'budget', 'moderate', 'premium'], default: 'moderate' },
        duration: { type: String, default: '2-3 hours' },
        hostName: { type: String, default: '' },
        hostContact: { type: String, default: '' },
        languages: [{ type: String }],
        includes: [{ type: String }],
        meetingPoint: { type: String, default: '' },
        vibe: { type: String, default: 'peaceful' },
        timing: { type: String, default: '' },
        isVerified: { type: Boolean, default: false },
        isFeatured: { type: Boolean, default: false },
        submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 0, max: 10, default: 7 },
        bestTime: { type: String, default: 'anytime' },
        crowdLevel: { type: String, default: 'low' },
    },
    { timestamps: true },
);

ExperienceSchema.index({ location: '2dsphere' });
ExperienceSchema.index({ title: 'text', description: 'text' });

export const Experience = mongoose.model<IExperience>('Experience', ExperienceSchema);

export const EXPERIENCE_TYPES: { id: ExperienceType; name: string }[] = [
    { id: 'home-cooked-meal', name: 'Home-Cooked Meals' },
    { id: 'heritage-walk', name: 'Heritage Walks' },
    { id: 'craft-workshop', name: 'Craft Workshops' },
    { id: 'village-visit', name: 'Village Visits' },
    { id: 'cultural-session', name: 'Cultural Sessions' },
    { id: 'slow-travel-itinerary', name: 'Slow Travel Itineraries' },
    { id: 'neighborhood-exploration', name: 'Neighborhood Explorations' },
];

export const TRAVELER_TYPES: { id: TravelerType; name: string; description: string }[] = [
    { id: 'slow-traveler', name: 'Slow Traveler', description: 'Takes time to immerse, never rushes' },
    { id: 'cultural-explorer', name: 'Cultural Explorer', description: 'Seeks traditions, rituals, and local life' },
    { id: 'foodie', name: 'Foodie', description: 'Travels for taste, craves authentic flavors' },
    { id: 'photographer', name: 'Photographer', description: 'Frames stories through the lens' },
    { id: 'wellness-seeker', name: 'Wellness Seeker', description: 'Finds peace through yoga, meditation, nature' },
    { id: 'solo-female', name: 'Solo Female', description: 'Travels independently, values safety & community' },
    { id: 'history-lover', name: 'History Lover', description: 'Chases stories etched in stone and time' },
];
