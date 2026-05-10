import mongoose, { Schema, Document } from 'mongoose';

export interface IGlobalSettings extends Document {
    hero: {
        title: string;
        subtitle: string;
        backgroundImage: string;
        phoneImage: string;
    };
    philosophy: {
        title: string;
        subtitle: string;
        cards: Array<{
            title: string;
            description: string;
            icon: string;
        }>;
    };
    cta: {
        title: string;
        subtitle: string;
        buttonText: string;
        image: string;
    };
    updatedBy: mongoose.Types.ObjectId;
}

const GlobalSettingsSchema: Schema = new Schema({
    hero: {
        title: { type: String, default: 'Find Peace in Your City' },
        subtitle: { type: String, default: 'Rediscover the rhythm of intentional living.' },
        backgroundImage: { type: String, default: '' },
        phoneImage: { type: String, default: '' }
    },
    philosophy: {
        title: { type: String, default: 'Philosophy of Presence' },
        subtitle: { type: String, default: 'Why we advocate for a slower urban pace.' },
        cards: [{
            title: String,
            description: String,
            icon: String
        }]
    },
    cta: {
        title: { type: String, default: 'Ready to slow down?' },
        subtitle: { type: String, default: 'Join a community of 50,000+ urban dwellers.' },
        buttonText: { type: String, default: 'Start Your Journey' },
        image: { type: String, default: '' }
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const GlobalSettings = mongoose.model<IGlobalSettings>('GlobalSettings', GlobalSettingsSchema);
