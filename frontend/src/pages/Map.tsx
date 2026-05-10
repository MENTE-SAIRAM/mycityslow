import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { X, Heart, Share2, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import api from '../api/axios';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';

interface Spot {
    _id: string;
    title?: string;
    name?: string;
    location: {
        type: string;
        coordinates: [number, number]; // [lng, lat]
    };
    description: string;
    images?: string[];
    peaceScore: number;
    category?: string;
    address?: string;
}

export default function Map() {
    const navigate = useNavigate();
    const { user } = useAppStore();
    const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
    const queryClient = useQueryClient();

    const { data: allSpots = [], isLoading } = useQuery({
        queryKey: ['allSpots'],
        queryFn: () => api.get('/discovery/spots').then(res => res.data.data.spots || res.data.data || []),
    });

    const { data: collectionData } = useQuery({
        queryKey: ['collection'],
        queryFn: () => api.get('/collection').then(res => res.data.data.spots),
        enabled: !!user,
    });

    const savedIds = new Set(collectionData?.map((s: any) => s._id) || []);

    const getSpotName = (spot: Spot) => spot.title || spot.name || 'Peaceful Spot';

    const handleToggleSave = async (id: string) => {
        if (!user) {
            navigate('/login');
            return;
        }
        const wasSaved = savedIds.has(id);
        try {
            if (wasSaved) {
                await api.delete(`/collection/${id}`);
            } else {
                await api.post(`/collection/${id}`);
            }
            queryClient.invalidateQueries({ queryKey: ['collection'] });
        } catch (err) {
            console.error('Failed to toggle save', err);
        }
    };

    // Center map on first spot or default to center India
    const defaultCenter: [number, number] = allSpots.length > 0 && allSpots[0].location?.coordinates
        ? [allSpots[0].location.coordinates[1], allSpots[0].location.coordinates[0]]
        : [20.5937, 78.9629]; // Center of India

    return (
        <div className="flex flex-col w-full min-h-screen bg-dark-bg">
            <Helmet>
                <title>Map — My City Slow</title>
                <meta name="description" content="Explore peaceful spots on an interactive map. Find your sanctuary." />
                <link rel="canonical" href="https://mycityslow.com/map" />
            </Helmet>

            <div className="relative w-full h-screen">
                {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center bg-dark-card">
                        <p className="text-sage-light text-lg">Loading map...</p>
                    </div>
                ) : (
                    <MapContainer center={defaultCenter} zoom={12} scrollWheelZoom={false} className="w-full h-full">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap contributors"
                        />
                        {allSpots.map((spot: Spot) => {
                            if (!spot.location?.coordinates) return null;
                            const [lng, lat] = spot.location.coordinates;
                            return (
                                <Marker
                                    key={spot._id}
                                    position={[lat, lng]}
                                    eventHandlers={{
                                        click: () => setSelectedSpot(spot),
                                    }}
                                >
                                    <Popup className="themed-map-popup">
                                        <div className="p-2">
                                            <h3 className="font-bold text-sm text-white">{getSpotName(spot)}</h3>
                                            <p className="text-xs text-sage-light">{spot.address}</p>
                                            <p className="text-xs font-semibold mt-1 text-sage">Peace: {spot.peaceScore}/10</p>
                                            <button
                                                onClick={() => navigate(`/spot/${spot._id}`)}
                                                className="mt-2 inline-flex items-center justify-center rounded-lg bg-sage/20 px-2 py-1 text-xs font-bold text-sage-light hover:bg-sage/30"
                                            >
                                                View details
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                )}

                {/* Spot Detail Panel */}
                {selectedSpot && (
                    <div className="absolute bottom-0 left-0 right-0 md:bottom-8 md:left-8 md:right-auto md:max-w-sm z-40 bg-dark-card/95 backdrop-blur-lg border border-white/10 rounded-t-[3rem] md:rounded-[3rem] shadow-2xl overflow-hidden">
                        <button
                            onClick={() => setSelectedSpot(null)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>

                        <div className="max-h-[70vh] overflow-y-auto">
                            {selectedSpot.images && selectedSpot.images.length > 0 && (
                                <img
                                    src={selectedSpot.images[0]}
                                    alt={getSpotName(selectedSpot)}
                                    className="w-full h-48 object-cover"
                                />
                            )}

                            <div className="p-6">
                                <h2 className="text-2xl font-extrabold text-white mb-2">{getSpotName(selectedSpot)}</h2>

                                {selectedSpot.address && (
                                    <div className="flex items-start gap-2 mb-4">
                                        <MapPin className="w-4 h-4 text-sage-light flex-shrink-0 mt-1" />
                                        <p className="text-sm text-sage-light">{selectedSpot.address}</p>
                                    </div>
                                )}

                                <div className="mb-6 p-4 bg-sage/10 rounded-2xl border border-sage/20">
                                    <p className="text-sm text-sage-light mb-2">Peace Factor</p>
                                    <div className="flex items-center gap-3">
                                        <div className="text-4xl font-extrabold text-sage">{selectedSpot.peaceScore}/10</div>
                                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-sage transition-all"
                                                style={{ width: `${(selectedSpot.peaceScore / 10) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {selectedSpot.description && (
                                    <div className="mb-6">
                                        <p className="text-sm text-white/80 leading-relaxed">{selectedSpot.description}</p>
                                    </div>
                                )}

                                {selectedSpot.category && (
                                    <div className="mb-6 inline-block">
                                        <span className="text-xs font-bold uppercase tracking-wider text-sage bg-sage/20 px-3 py-1 rounded-full">
                                            {selectedSpot.category}
                                        </span>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-6 border-t border-white/5">
                                    <button
                                        onClick={() => handleToggleSave(selectedSpot._id)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full font-bold transition-all ${
                                            savedIds.has(selectedSpot._id)
                                                ? 'bg-red-500/20 text-red-400 border border-red-500/20'
                                                : 'bg-sage/20 text-sage-light border border-sage/20 hover:bg-sage/30'
                                        }`}
                                    >
                                        <Heart className={`w-4 h-4 ${savedIds.has(selectedSpot._id) ? 'fill-current' : ''}`} />
                                        {savedIds.has(selectedSpot._id) ? 'Saved' : 'Save'}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/spot/${selectedSpot._id}`)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold text-white transition-all border border-white/10"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
