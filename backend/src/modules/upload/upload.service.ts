// ─────────────────────────────────────────────────────────────
// Upload Service — Cloudinary image hosting
// ─────────────────────────────────────────────────────────────
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadService = {
    /**
     * Upload single image to Cloudinary
     */
    async uploadImage(fileBuffer: Buffer, filename: string): Promise<{ url: string; publicId: string; size: number }> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'my-city-slow/spots',
                    resource_type: 'auto',
                    public_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    transformation: [
                        { width: 1200, height: 800, crop: 'fill', quality: 'auto' },
                    ],
                },
                (error, result) => {
                    if (error) reject(error);
                    else
                        resolve({
                            url: result?.secure_url || '',
                            publicId: result?.public_id || '',
                            size: result?.bytes || 0,
                        });
                }
            );

            // Convert buffer to stream and pipe to Cloudinary
            Readable.from(fileBuffer).pipe(uploadStream);
        });
    },

    /**
     * Upload multiple images to Cloudinary
     */
    async uploadMultiple(
        files: Buffer[],
        filenames: string[]
    ): Promise<Array<{ url: string; publicId: string; size: number }>> {
        const uploads = files.map((buffer, index) => this.uploadImage(buffer, filenames[index]));
        return Promise.all(uploads);
    },

    /**
     * Delete image from Cloudinary by public ID
     */
    async deleteImage(publicId: string): Promise<boolean> {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            return result.result === 'ok';
        } catch (error) {
            console.error('Failed to delete image from Cloudinary:', error);
            return false;
        }
    },
};
