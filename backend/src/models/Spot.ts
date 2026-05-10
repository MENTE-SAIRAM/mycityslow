// ─────────────────────────────────────────────────────────────
// Model: Spot — peaceful places to discover
// ─────────────────────────────────────────────────────────────
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISpot extends Document {
    title: string;
    description: string;
    location: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
    city: Types.ObjectId;
    categories: string[];
    vibe: 'very-calm' | 'moderate' | 'energetic';
    bestTime: 'early-morning' | 'morning' | 'afternoon' | 'evening' | 'night' | 'weekend' | 'anytime';
    crowdLevel: 'very-low' | 'low' | 'medium' | 'high';
    images: string[];
    peaceScore: number;
    activities: string[];
    submittedBy?: Types.ObjectId;
    isApproved: boolean;
    isFeatured: boolean;
    address: string;
    transportation: string;
    openingHours: string;
    createdAt: Date;
    updatedAt: Date;
}

const SpotSchema = new Schema<ISpot>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
        categories: [{ type: String }],
        vibe: {
            type: String,
            enum: ['very-calm', 'moderate', 'energetic'],
            default: 'very-calm',
        },
        bestTime: {
            type: String,
            enum: ['early-morning', 'morning', 'afternoon', 'evening', 'night', 'weekend', 'anytime'],
            default: 'anytime',
        },
        crowdLevel: {
            type: String,
            enum: ['very-low', 'low', 'medium', 'high'],
            default: 'low',
        },
        images: [{ type: String }],
        peaceScore: { type: Number, min: 0, max: 10, default: 7 },
        activities: [{ type: String }],
        submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        isApproved: { type: Boolean, default: true },
        isFeatured: { type: Boolean, default: false },
        address: { type: String, default: '' },
        transportation: { type: String, default: '' },
        openingHours: { type: String, default: '' },
    },
    { timestamps: true },
);

// Geospatial index for nearby queries
SpotSchema.index({ location: '2dsphere' });
// Text index for search
SpotSchema.index({ title: 'text', description: 'text', address: 'text' });

export const Spot = mongoose.model<ISpot>('Spot', SpotSchema);
