export const resolveImageUrl = (url?: string): string => {
    if (!url) return '';
    // Cloudinary URLs and external URLs are already absolute
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    // Local /uploads/ paths need backend origin prefix
    if (url.startsWith('/uploads/')) return `http://localhost:3000${url}`;
    return url;
};
