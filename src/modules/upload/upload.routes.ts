// ─────────────────────────────────────────────────────────────
// Upload: Routes — image upload with Cloudinary
// ─────────────────────────────────────────────────────────────
import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { authenticate } from '../../middleware/auth';
import { uploadService } from './upload.service';
import { createError } from '../../middleware/errorHandler';

// Multer memory storage (buffer only, no disk)
const storage = multer.memoryStorage();

// File filter — images only
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

const router = Router();

/** POST /api/upload — single image upload to Cloudinary */
router.post('/', authenticate, upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            throw createError(400, 'No image file uploaded');
        }

        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            throw createError(503, 'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env');
        }

        const result = await uploadService.uploadImage(req.file.buffer, req.file.originalname);

        res.status(201).json({
            url: result.url,
            publicId: result.publicId,
            size: result.size,
            mimetype: req.file.mimetype,
        });
    } catch (error) {
        next(error);
    }
});

/** POST /api/upload/multiple — multiple images upload to Cloudinary (max 5) */
router.post('/multiple', authenticate, upload.array('images', 5), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            throw createError(400, 'No image files uploaded');
        }

        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            throw createError(503, 'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env');
        }

        const buffers = files.map((f) => f.buffer);
        const filenames = files.map((f) => f.originalname);

        const results = await uploadService.uploadMultiple(buffers, filenames);

        const uploaded = results.map((result, index) => ({
            url: result.url,
            publicId: result.publicId,
            size: result.size,
            mimetype: files[index].mimetype,
        }));

        res.status(201).json({ images: uploaded });
    } catch (error) {
        next(error);
    }
});

export default router;
