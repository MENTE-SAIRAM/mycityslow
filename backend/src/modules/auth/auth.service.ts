// ─────────────────────────────────────────────────────────────
// Auth: Service — business logic for authentication
// ─────────────────────────────────────────────────────────────
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../../models/User';
import { createError } from '../../middleware/errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '15m';
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';

// Generate access token
const generateAccessToken = (user: IUser): string => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION as any },
    );
};

// Generate refresh token
const generateRefreshToken = (user: IUser): string => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_REFRESH_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRATION as any },
    );
};

export const authService = {
    /**
     * Register a new user
     */
    async register(data: { name: string; email: string; password: string; phone?: string; city?: string }) {
        // Check if user already exists
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            throw createError(409, 'User with this email already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        // Create user
        const user = await User.create({
            ...data,
            password: hashedPassword,
        });

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store refresh token
        await User.findByIdAndUpdate(user._id, { refreshToken });

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                city: user.city,
                avatar: user.avatar,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    },

    /**
     * Login user
     */
    async login(email: string, password: string) {
        // Find user with password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw createError(401, 'Invalid email or password');
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw createError(401, 'Invalid email or password');
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store refresh token
        await User.findByIdAndUpdate(user._id, { refreshToken });

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                city: user.city,
                avatar: user.avatar,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    },

    /**
     * Refresh access token
     */
    async refreshToken(refreshToken: string) {
        try {
            const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string; email: string; role: string };

            // Verify the refresh token matches what's stored
            const user = await User.findById(decoded.id).select('+refreshToken');
            if (!user || user.refreshToken !== refreshToken) {
                throw createError(401, 'Invalid refresh token');
            }

            // Generate new tokens
            const newAccessToken = generateAccessToken(user);
            const newRefreshToken = generateRefreshToken(user);

            // Update stored refresh token
            await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        } catch (error: any) {
            if (error.statusCode) throw error;
            throw createError(401, 'Invalid or expired refresh token');
        }
    },

    /**
     * Get user profile
     */
    async getProfile(userId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw createError(404, 'User not found');
        }
        return user;
    },

    /**
     * Update user profile
     */
    async updateProfile(userId: string, data: { name?: string; phone?: string; city?: string; avatar?: string }) {
        const user = await User.findByIdAndUpdate(userId, data, { new: true, runValidators: true });
        if (!user) {
            throw createError(404, 'User not found');
        }
        return user;
    },
};
