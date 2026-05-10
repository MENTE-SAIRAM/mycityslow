// ─────────────────────────────────────────────────────────────
// Model: Review — user reviews for a spot
// ─────────────────────────────────────────────────────────────
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IReview extends Document {
    spot: Types.ObjectId;
    user: Types.ObjectId;
    rating: number;
    text: string;
    categories: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        spot: { type: Schema.Types.ObjectId, ref: 'Spot', required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        text: { type: String, required: true, trim: true },
        categories: [{ type: String }],
    },
    { timestamps: true },
);

// Prevent multiple reviews from same user for the same spot
ReviewSchema.index({ spot: 1, user: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
