// ─────────────────────────────────────────────────────────────
// Model: User — registered users and admins
// ─────────────────────────────────────────────────────────────
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone?: string;
    city?: string;
    avatar?: string;
    role: 'user' | 'admin';
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, select: false },
        phone: { type: String, trim: true, default: '' },
        city: { type: String, trim: true, default: '' },
        avatar: { type: String, default: '' },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        refreshToken: { type: String, select: false },
    },
    { timestamps: true },
);

export const User = mongoose.model<IUser>('User', UserSchema);
