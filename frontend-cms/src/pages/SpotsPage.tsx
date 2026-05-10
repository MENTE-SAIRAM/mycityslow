import { useEffect, useState, FormEvent } from 'react';
import api from '../api/axios';
import { useSearchParams } from 'react-router-dom';

interface Spot {
    _id: string;
    title: string;
    description: string;
    city: any;
    vibe: string;
    bestTime: string;
    crowdLevel: string;
    peaceScore: number;
    isApproved: boolean;
    isFeatured: boolean;
    categories: string[];
    activities: string[];
    address: string;
    location: any;
    images?: string[];
}

const emptyForm = {
    _id: '', title: '', description: '', city: '', vibe: 'very-calm', bestTime: 'anytime',
    crowdLevel: 'low', peaceScore: 7, address: '', lat: '', lng: '',
    categories: '', activities: '', coverImage: '', otherImages: [] as string[],
};

const toPreviewUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('/uploads/')) return `http://localhost:3000${url}`;
    return url;
};

export default function SpotsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [spots, setSpots] = useState<Spot[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [coverUploading, setCoverUploading] = useState(false);
    const [galleryUploading, setGalleryUploading] = useState(false);
    const [cityFilter, setCityFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalSpots, setTotalSpots] = useState(0);
    const LIMIT = 20;

    const fetchSpots = (page: number = 1) => {
        setLoading(true);
        api.get(`/admin/spots?page=${page}&limit=${LIMIT}`)
            .then((res) => {
                const data = res.data.data || res.data;
                setSpots(data.spots || []);
                setTotalPages(data.pagination?.totalPages || 1);
                setTotalSpots(data.pagination?.total || 0);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchSpots(currentPage);
    }, [currentPage]);

    useEffect(() => {
        api.get('/admin/cities').then((res) => setCities((res.data.data || res.data).cities || [])).catch(console.error);
    }, []);

    const handleEdit = (spot: Spot) => {
        const images = spot.images || [];
        setForm({
            _id: spot._id,
            title: spot.title || '',
            description: spot.description || '',
            city: typeof spot.city === 'object' ? spot.city?._id : spot.city,
            vibe: spot.vibe || 'very-calm',
            bestTime: spot.bestTime || 'anytime',
            crowdLevel: spot.crowdLevel || 'low',
            peaceScore: spot.peaceScore || 7,
            address: spot.address || '',
            lat: spot.location?.coordinates?.[1]?.toString() || '',
            lng: spot.location?.coordinates?.[0]?.toString() || '',
            categories: (spot.categories || []).join(', '),
            activities: (spot.activities || []).join(', '),
            coverImage: images[0] || '',
            otherImages: images.slice(1),
        });
        setShowForm(true);
    };

    const uploadCoverImage = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        const res = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        const data = res.data.data || res.data;
        return data.url as string;
    };

    const uploadGalleryImages = async (files: FileList) => {
        const formData = new FormData();
        Array.from(files).forEach((file) => formData.append('images', file));
        const res = await api.post('/upload/multiple', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        const data = res.data.data || res.data;
        return (data.images || []).map((item: any) => item.url as string);
    };

    const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setCoverUploading(true);
            const url = await uploadCoverImage(file);
            setForm((prev) => ({ ...prev, coverImage: url }));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Cover image upload failed');
        } finally {
            setCoverUploading(false);
            e.target.value = '';
        }
    };

    const handleGalleryFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setGalleryUploading(true);
            const urls = await uploadGalleryImages(files);
            setForm((prev) => ({
                ...prev,
                otherImages: [...prev.otherImages, ...urls].filter((url, index, arr) => arr.indexOf(url) === index),
            }));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Gallery image upload failed');
        } finally {
            setGalleryUploading(false);
            e.target.value = '';
        }
    };

    useEffect(() => {
        const editId = searchParams.get('edit');
        if (!editId || spots.length === 0) return;

        const foundSpot = spots.find((s) => s._id === editId);
        if (foundSpot) {
            handleEdit(foundSpot);
            searchParams.delete('edit');
            setSearchParams(searchParams, { replace: true });
        }
    }, [spots, searchParams, setSearchParams]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const { _id, lat, lng, coverImage, otherImages, ...rest } = form;
            const finalImages = [coverImage.trim(), ...otherImages]
                .filter(Boolean)
                .filter((url, index, arr) => arr.indexOf(url) === index);

            const payload = {
                ...rest,
                peaceScore: Number(form.peaceScore),
                categories: form.categories.split(',').map(s => s.trim()).filter(Boolean),
                activities: form.activities.split(',').map(s => s.trim()).filter(Boolean),
                images: finalImages,
                location: {
                    type: 'Point',
                    coordinates: [parseFloat(lng) || 0, parseFloat(lat) || 0],
                },
            };

            if (_id) {
                await api.put(`/admin/spots/${_id}`, payload);
            } else {
                await api.post('/admin/spots', payload);
            }

            setShowForm(false);
            setForm(emptyForm);
            setCurrentPage(1);
            fetchSpots(1);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error saving spot');
        }
    };

    const toggleApproval = async (spot: Spot) => {
        try {
            if (spot.isApproved) {
                await api.put(`/admin/spots/${spot._id}/reject`);
            } else {
                await api.put(`/admin/spots/${spot._id}/approve`);
            }
            fetchSpots(currentPage);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this spot permanently?')) return;
        try {
            await api.delete(`/admin/spots/${id}`);
            fetchSpots(currentPage);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error deleting spot');
        }
    };

    const filteredSpots = cityFilter === 'all'
        ? spots
        : spots.filter((spot) => {
            const spotCityId = typeof spot.city === 'object' ? spot.city?._id : spot.city;
            return spotCityId === cityFilter;
        });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Spots</h1>
                    <p className="text-dark-400 mt-1">Manage peaceful spots across India</p>
                </div>
                <button onClick={() => { setForm(emptyForm); setShowForm(!showForm); }} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-all">
                    {showForm ? 'Cancel' : '+ Add Spot'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-dark-900 border border-dark-700 rounded-xl p-6 mb-6 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white">{form._id ? 'Edit Spot' : 'Add New Spot'}</h3>
                        {form._id && (
                            <button type="button" onClick={() => { setForm(emptyForm); setShowForm(false); }} className="text-dark-400 hover:text-white text-sm">
                                Close X
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                        <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required className="px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                            <option value="">Select City</option>
                            {cities.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                        <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                        <input placeholder="Categories (comma separated)" value={form.categories} onChange={(e) => setForm({ ...form, categories: e.target.value })} className="px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                        <input placeholder="Tags/Activities (comma separated)" value={form.activities} onChange={(e) => setForm({ ...form, activities: e.target.value })} className="px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                        <input placeholder="Latitude" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} className="px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                        <input placeholder="Longitude" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} className="px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                        <select value={form.vibe} onChange={(e) => setForm({ ...form, vibe: e.target.value })} className="px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                            <option value="very-calm">Very Calm</option>
                            <option value="moderate">Moderate</option>
                            <option value="energetic">Energetic</option>
                        </select>
                        <select value={form.bestTime} onChange={(e) => setForm({ ...form, bestTime: e.target.value })} className="px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                            <option value="early-morning">Early Morning</option>
                            <option value="morning">Morning</option>
                            <option value="afternoon">Afternoon</option>
                            <option value="evening">Evening</option>
                            <option value="night">Night</option>
                            <option value="weekend">Weekend</option>
                            <option value="anytime">Anytime</option>
                        </select>
                        <select value={form.crowdLevel} onChange={(e) => setForm({ ...form, crowdLevel: e.target.value })} className="px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                            <option value="very-low">Very Low</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <input type="number" placeholder="Peace Score (0-10)" min={0} max={10} step={0.1} value={form.peaceScore} onChange={(e) => setForm({ ...form, peaceScore: parseFloat(e.target.value) })} className="px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-dark-800 border border-dark-600 rounded-lg p-4">
                            <label className="block text-sm font-medium text-dark-300 mb-2">Cover Image</label>
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                onChange={handleCoverFileChange}
                                disabled={coverUploading}
                                className="block w-full text-sm text-dark-300 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-700"
                            />
                            {coverUploading && <p className="text-xs text-primary-300 mt-2">Uploading cover image...</p>}
                            {form.coverImage && (
                                <div className="mt-3">
                                    <img src={toPreviewUrl(form.coverImage)} alt="Cover preview" className="w-full h-36 object-cover rounded-md border border-dark-600" />
                                    <button
                                        type="button"
                                        onClick={() => setForm((prev) => ({ ...prev, coverImage: '' }))}
                                        className="mt-2 text-xs text-red-400 hover:text-red-300"
                                    >
                                        Remove cover image
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="bg-dark-800 border border-dark-600 rounded-lg p-4">
                            <label className="block text-sm font-medium text-dark-300 mb-2">Other Images</label>
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                multiple
                                onChange={handleGalleryFilesChange}
                                disabled={galleryUploading}
                                className="block w-full text-sm text-dark-300 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-700"
                            />
                            {galleryUploading && <p className="text-xs text-primary-300 mt-2">Uploading gallery images...</p>}
                            {form.otherImages.length > 0 && (
                                <div className="mt-3 grid grid-cols-3 gap-2">
                                    {form.otherImages.map((url) => (
                                        <div key={url} className="relative group">
                                            <img src={toPreviewUrl(url)} alt="Spot gallery" className="w-full h-20 object-cover rounded-md border border-dark-600" />
                                            <button
                                                type="button"
                                                onClick={() => setForm((prev) => ({ ...prev, otherImages: prev.otherImages.filter((img) => img !== url) }))}
                                                className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} className="w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                    <button type="submit" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-all">{form._id ? 'Save Changes' : 'Create Spot'}</button>
                </form>
            )}

            {/* Table */}
            {loading ? (
                <div className="text-dark-400 text-center py-12">Loading spots...</div>
            ) : (
                <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-dark-700 bg-dark-900/80">
                        <div className="text-sm text-dark-400">
                            Page {currentPage} of {totalPages} • Total: {totalSpots} spots
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-sm text-dark-400">Filter by city</label>
                            <select
                                value={cityFilter}
                                onChange={(e) => setCityFilter(e.target.value)}
                                className="px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                            >
                                <option value="all">All Cities</option>
                                {cities.map((c) => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-700">
                                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">Title</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">City</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">Vibe</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">Peace</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSpots.map((spot) => (
                                <tr key={spot._id} className="border-b border-dark-800 hover:bg-dark-800/50 transition-all">
                                    <td className="px-6 py-4 text-sm text-white font-medium max-w-[200px] truncate">{spot.title}</td>
                                    <td className="px-6 py-4 text-sm text-dark-300">{spot.city?.name || '—'}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${spot.vibe === 'very-calm' ? 'bg-green-500/10 text-green-400' : spot.vibe === 'moderate' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                            {spot.vibe}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-primary-400 font-medium">{spot.peaceScore}/10</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${spot.isApproved ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {spot.isApproved ? 'Approved' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm space-x-2">
                                        <button onClick={() => toggleApproval(spot)} className={`px-3 py-1 rounded-md text-xs transition-all ${spot.isApproved ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}>
                                            {spot.isApproved ? 'Unapprove' : 'Approve'}
                                        </button>
                                        <button
                                            onClick={() => window.open(`/spots?edit=${spot._id}`, '_blank', 'noopener,noreferrer')}
                                            className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-md hover:bg-blue-500/20 transition-all text-xs"
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(spot._id)} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20 transition-all text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredSpots.length === 0 && <div className="text-center py-12 text-dark-400">No spots found for selected city.</div>}
                    
                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-dark-700 bg-dark-900/50">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white text-sm hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            ← Previous
                        </button>
                        
                        <div className="flex items-center gap-2">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum: number;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-3 py-1 rounded-lg text-sm transition-all ${
                                            currentPage === pageNum
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-dark-800 border border-dark-600 text-dark-300 hover:bg-dark-700'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white text-sm hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

