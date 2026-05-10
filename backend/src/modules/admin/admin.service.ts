// ─────────────────────────────────────────────────────────────
// Admin: Service — dashboard stats, CRUD for CMS
// ─────────────────────────────────────────────────────────────
import mongoose from 'mongoose';
import { User } from '../../models/User';
import { City, ICity } from '../../models/City';
import { Spot } from '../../models/Spot';
import { SpotSubmission } from '../../models/SpotSubmission';
import { GlobalSettings } from '../../models/GlobalSettings';
import { Experience } from '../../models/Experience';
import { LocalStory } from '../../models/LocalStory';
import { CuratedGuide } from '../../models/CuratedGuide';
import { createError } from '../../middleware/errorHandler';

export const adminService = {
    normalizeSpotPayload(data: any) {
        const sanitized = { ...data };
        delete sanitized._id;

        const sourceImages = Array.isArray(sanitized.images) ? sanitized.images : [];
        const sourceOtherImages = Array.isArray(sanitized.otherImages) ? sanitized.otherImages : [];
        const sourceCoverImage = typeof sanitized.coverImage === 'string' ? sanitized.coverImage : '';

        const normalizedImages = [sourceCoverImage, ...sourceImages, ...sourceOtherImages]
            .map((url) => (typeof url === 'string' ? url.trim() : ''))
            .filter(Boolean)
            .filter((url, index, arr) => arr.indexOf(url) === index);

        sanitized.images = normalizedImages;
        delete sanitized.coverImage;
        delete sanitized.otherImages;

        return sanitized;
    },

    // ─── Dashboard ───────────────────────────────────────────
    async getDashboardStats() {
        const [totalUsers, totalCities, totalSpots, approvedSpots, pendingSubmissions] = await Promise.all([
            User.countDocuments(),
            City.countDocuments(),
            Spot.countDocuments(),
            Spot.countDocuments({ isApproved: true }),
            SpotSubmission.countDocuments({ status: 'pending' }),
        ]);

        return {
            totalUsers,
            totalCities,
            totalSpots,
            approvedSpots,
            pendingSubmissions,
        };
    },

    // ─── Cities CRUD ─────────────────────────────────────────
    async getAllCities(page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;
        const [cities, total] = await Promise.all([
            City.find().sort({ name: 1 }).skip(skip).limit(limit),
            City.countDocuments(),
        ]);
        return { cities, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    },

    async createCity(data: Partial<ICity>) {
        // Auto-generate slug from name
        const slug = data.slug || data.name!.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const existing = await City.findOne({ slug });
        if (existing) throw createError(409, 'City with this slug already exists');

        return City.create({ ...data, slug });
    },

    async updateCity(id: string, data: Partial<ICity>) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw createError(400, 'Invalid city ID');
        const city = await City.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!city) throw createError(404, 'City not found');
        return city;
    },

    async deleteCity(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw createError(400, 'Invalid city ID');
        const city = await City.findByIdAndDelete(id);
        if (!city) throw createError(404, 'City not found');
        // Also remove spots belonging to this city
        await Spot.deleteMany({ city: id });
        return { message: 'City and associated spots deleted' };
    },

    // ─── Spots Management ───────────────────────────────────
    async getAllSpots(page: number = 1, limit: number = 20, filters: any = {}) {
        const skip = (page - 1) * limit;
        const query: any = {};
        if (filters.isApproved !== undefined) query.isApproved = filters.isApproved;
        if (filters.city) query.city = filters.city;

        const [spots, total] = await Promise.all([
            Spot.find(query)
                .populate('city', 'name slug')
                .populate('submittedBy', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Spot.countDocuments(query),
        ]);
        return { spots, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    },

    async createSpot(data: any) {
        const sanitizedData = this.normalizeSpotPayload(data);
        return Spot.create(sanitizedData);
    },

    async updateSpot(id: string, data: any) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw createError(400, 'Invalid spot ID');
        const sanitizedData = this.normalizeSpotPayload(data);
        const spot = await Spot.findByIdAndUpdate(id, sanitizedData, { new: true, runValidators: true });
        if (!spot) throw createError(404, 'Spot not found');
        return spot;
    },

    async deleteSpot(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw createError(400, 'Invalid spot ID');
        const spot = await Spot.findByIdAndDelete(id);
        if (!spot) throw createError(404, 'Spot not found');
        return { message: 'Spot deleted' };
    },

    async approveSpot(id: string) {
        return this.updateSpot(id, { isApproved: true });
    },

    async rejectSpot(id: string) {
        return this.updateSpot(id, { isApproved: false });
    },

    // ─── Submissions Moderation ─────────────────────────────
    async getSubmissions(page: number = 1, limit: number = 20, status?: string) {
        const skip = (page - 1) * limit;
        const query: any = {};
        if (status) query.status = status;

        const [submissions, total] = await Promise.all([
            SpotSubmission.find(query)
                .populate('submittedBy', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            SpotSubmission.countDocuments(query),
        ]);
        return { submissions, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    },

    async approveSubmission(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw createError(400, 'Invalid submission ID');
        const submission = await SpotSubmission.findById(id);
        if (!submission) throw createError(404, 'Submission not found');

        // Find or create the city
        let city = await City.findOne({ name: new RegExp(`^${submission.city}$`, 'i') });
        if (!city) {
            city = await City.create({
                name: submission.city,
                slug: submission.city.toLowerCase().replace(/\s+/g, '-'),
                state: 'Unknown',
            });
        }

        // Create the spot from submission
        const spot = await Spot.create({
            title: submission.title,
            description: submission.description,
            location: submission.location,
            city: city._id,
            categories: submission.categories,
            images: submission.images,
            submittedBy: submission.submittedBy,
            isApproved: true,
            address: submission.address,
            bestTime: submission.bestTime,
            vibe: submission.vibe,
            crowdLevel: submission.crowdLevel,
        });

        // Update submission status
        submission.status = 'approved';
        await submission.save();

        // Increment city spot count
        await City.findByIdAndUpdate(city._id, { $inc: { totalSpots: 1 } });

        return { submission, spot };
    },

    async rejectSubmission(id: string, reviewNote: string = '') {
        if (!mongoose.Types.ObjectId.isValid(id)) throw createError(400, 'Invalid submission ID');
        const submission = await SpotSubmission.findByIdAndUpdate(
            id,
            { status: 'rejected', reviewNote },
            { new: true },
        );
        if (!submission) throw createError(404, 'Submission not found');
        return submission;
    },

    // ─── Global Settings ─────────────────────────────────────
    async getGlobalSettings() {
        let settings = await GlobalSettings.findOne();
        if (!settings) {
            // Create default settings if none exist
            settings = await GlobalSettings.create({
                hero: {
                    title: 'Find Peace in Your City',
                    subtitle: 'Rediscover the rhythm of intentional living.',
                    backgroundImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=3000&auto=format&fit=crop',
                    phoneImage: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1000&auto=format&fit=crop'
                },
                philosophy: {
                    title: 'Philosophy of Presence',
                    subtitle: 'Why we advocate for a slower urban pace.',
                    cards: [
                        { title: 'Mental Clarity', description: 'Reducing noise and visual clutter...', icon: 'sparkles' },
                        { title: 'Heart Rate', description: 'Curating spaces with proven low-decibel...', icon: 'heart' },
                        { title: 'Urban Harmony', description: 'Fostering a deeper connection...', icon: 'leaf' }
                    ]
                },
                cta: {
                    title: 'Ready to slow down?',
                    subtitle: 'Join a community of 50,000+ urban dwellers.',
                    buttonText: 'Start Your Journey',
                    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop'
                }
            });
        }
        return settings;
    },

    // ─── Experiences ─────────────────────────────────────────
    async getAllExperiences(page: number = 1, limit: number = 20, filters: any = {}) {
        const skip = (page - 1) * limit;
        const query: any = {};
        if (filters.isVerified !== undefined) query.isVerified = filters.isVerified;
        if (filters.city) query.city = filters.city;

        const [experiences, total] = await Promise.all([
            Experience.find(query)
                .populate('city', 'name slug')
                .populate('submittedBy', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Experience.countDocuments(query),
        ]);
        return { experiences, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    },

    async createExperience(data: any) {
        return Experience.create(data);
    },

    async updateExperience(id: string, data: any) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw createError(400, 'Invalid experience ID');
        const exp = await Experience.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!exp) throw createError(404, 'Experience not found');
        return exp;
    },

    async deleteExperience(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw createError(400, 'Invalid experience ID');
        const exp = await Experience.findByIdAndDelete(id);
        if (!exp) throw createError(404, 'Experience not found');
        return { message: 'Experience deleted' };
    },

    async approveExperience(id: string) {
        return this.updateExperience(id, { isVerified: true });
    },

    async rejectExperience(id: string) {
        return this.updateExperience(id, { isVerified: false });
    },

    // ─── Stories ─────────────────────────────────────────────
    async getAllStories(page: number = 1, limit: number = 20, status?: string) {
        const skip = (page - 1) * limit;
        const query: any = {};
        if (status === 'approved') query.isApproved = true;
        else if (status === 'pending') query.isApproved = false;

        const [stories, total] = await Promise.all([
            LocalStory.find(query)
                .populate('author', 'name email')
                .populate('city', 'name slug')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            LocalStory.countDocuments(query),
        ]);
        return { stories, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    },

    async approveStory(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw createError(400, 'Invalid story ID');
        const story = await LocalStory.findByIdAndUpdate(id, { isApproved: true }, { new: true });
        if (!story) throw createError(404, 'Story not found');
        return story;
    },

    async rejectStory(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw createError(400, 'Invalid story ID');
        const story = await LocalStory.findByIdAndUpdate(id, { isApproved: false }, { new: true });
        if (!story) throw createError(404, 'Story not found');
        return story;
    },

    // ─── Curated Guides ──────────────────────────────────────
    async getAllGuides() {
        const guides = await CuratedGuide.find()
            .populate('city', 'name slug')
            .sort({ createdAt: -1 });
        return { guides };
    },

    async createGuide(data: any) {
        const slug = data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return CuratedGuide.create({ ...data, slug });
    },

    async updateGuide(id: string, data: any) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw createError(400, 'Invalid guide ID');
        const guide = await CuratedGuide.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!guide) throw createError(404, 'Guide not found');
        return guide;
    },

    async deleteGuide(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) throw createError(400, 'Invalid guide ID');
        const guide = await CuratedGuide.findByIdAndDelete(id);
        if (!guide) throw createError(404, 'Guide not found');
        return { message: 'Guide deleted' };
    },

    async updateGlobalSettings(userId: string, data: any) {
        let settings = await GlobalSettings.findOne();
        if (!settings) {
            settings = new GlobalSettings(data);
        } else {
            Object.assign(settings, data);
        }
        settings.updatedBy = new mongoose.Types.ObjectId(userId);
        return settings.save();
    },
};
