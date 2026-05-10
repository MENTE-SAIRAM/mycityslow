import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILocalStory extends Document {
    title: string;
    content: string;
    author: Types.ObjectId;
    authorName: string;
    spot?: Types.ObjectId;
    experience?: Types.ObjectId;
    city: Types.ObjectId;
    images: string[];
    tags: string[];
    isApproved: boolean;
    likes: number;
    createdAt: Date;
    updatedAt: Date;
}

const LocalStorySchema = new Schema<ILocalStory>(
    {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        authorName: { type: String, required: true, trim: true },
        spot: { type: Schema.Types.ObjectId, ref: 'Spot' },
        experience: { type: Schema.Types.ObjectId, ref: 'Experience' },
        city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
        images: [{ type: String }],
        tags: [{ type: String }],
        isApproved: { type: Boolean, default: true },
        likes: { type: Number, default: 0 },
    },
    { timestamps: true },
);

LocalStorySchema.index({ spot: 1 });
LocalStorySchema.index({ experience: 1 });
LocalStorySchema.index({ city: 1 });
LocalStorySchema.index({ title: 'text', content: 'text', tags: 'text' });

export const LocalStory = mongoose.model<ILocalStory>('LocalStory', LocalStorySchema);
