// ─────────────────────────────────────────────────────────────
// Model: City — Indian cities with peaceful spots
// ─────────────────────────────────────────────────────────────
import mongoose, { Document, Schema } from 'mongoose';

export interface ICity extends Document {
    name: string;
    slug: string;
    state: string;
    image: string;
    description: string;
    totalSpots: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CitySchema = new Schema<ICity>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        state: { type: String, required: true, trim: true },
        image: { type: String, default: '' },
        description: { type: String, default: '' },
        totalSpots: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);

export const City = mongoose.model<ICity>('City', CitySchema);
