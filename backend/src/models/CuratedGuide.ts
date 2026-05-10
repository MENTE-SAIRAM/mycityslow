import mongoose, { Document, Schema, Types } from 'mongoose';

interface GuideSection {
    title: string;
    content: string;
    spots: Types.ObjectId[];
    experiences: Types.ObjectId[];
}

export interface ICuratedGuide extends Document {
    title: string;
    city: Types.ObjectId;
    slug: string;
    overview: string;
    sections: GuideSection[];
    travelerType: string;
    duration: string;
    image: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const GuideSectionSchema = new Schema<GuideSection>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    spots: [{ type: Schema.Types.ObjectId, ref: 'Spot' }],
    experiences: [{ type: Schema.Types.ObjectId, ref: 'Experience' }],
});

const CuratedGuideSchema = new Schema<ICuratedGuide>(
    {
        title: { type: String, required: true, trim: true },
        city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
        slug: { type: String, required: true, lowercase: true, trim: true },
        overview: { type: String, required: true },
        sections: [GuideSectionSchema],
        travelerType: { type: String, default: '' },
        duration: { type: String, default: 'Half day' },
        image: { type: String, default: '' },
        isPublished: { type: Boolean, default: false },
    },
    { timestamps: true },
);

CuratedGuideSchema.index({ city: 1, slug: 1 }, { unique: true });

export const CuratedGuide = mongoose.model<ICuratedGuide>('CuratedGuide', CuratedGuideSchema);
