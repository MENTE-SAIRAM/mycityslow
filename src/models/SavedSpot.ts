// ─────────────────────────────────────────────────────────────
// Model: SavedSpot — user's "My Slow List" collection
// ─────────────────────────────────────────────────────────────
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISavedSpot extends Document {
    user: Types.ObjectId;
    spot: Types.ObjectId;
    createdAt: Date;
}

const SavedSpotSchema = new Schema<ISavedSpot>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        spot: { type: Schema.Types.ObjectId, ref: 'Spot', required: true },
    },
    { timestamps: true },
);

// User can save a spot only once
SavedSpotSchema.index({ user: 1, spot: 1 }, { unique: true });

export const SavedSpot = mongoose.model<ISavedSpot>('SavedSpot', SavedSpotSchema);
