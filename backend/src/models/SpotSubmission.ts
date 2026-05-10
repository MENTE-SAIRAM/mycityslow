// ─────────────────────────────────────────────────────────────
// Model: SpotSubmission — user-submitted spots for moderation
// ─────────────────────────────────────────────────────────────
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISpotSubmission extends Document {
    title: string;
    description: string;
    location?: {
        type: 'Point';
        coordinates: [number, number];
    };
    city: string;
    categories: string[];
    images: string[];
    submittedBy: Types.ObjectId;
    status: 'pending' | 'approved' | 'rejected';
    reviewNote: string;
    address: string;
    bestTime: string;
    vibe: string;
    crowdLevel: string;
    transportation: string;
    openingHours: string;
    createdAt: Date;
    updatedAt: Date;
}

const SpotSubmissionSchema = new Schema<ISpotSubmission>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: { type: [Number] },
        },
        city: { type: String, required: true, trim: true },
        categories: [{ type: String }],
        images: [{ type: String }],
        submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        reviewNote: { type: String, default: '' },
        address: { type: String, default: '' },
        bestTime: { type: String, default: 'anytime' },
        vibe: { type: String, default: 'very-calm' },
        crowdLevel: { type: String, default: 'low' },
        transportation: { type: String, default: '' },
        openingHours: { type: String, default: '' },
    },
    { timestamps: true },
);

export const SpotSubmission = mongoose.model<ISpotSubmission>('SpotSubmission', SpotSubmissionSchema);
