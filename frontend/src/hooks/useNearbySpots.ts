import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export interface NearbySpot {
    _id: string;
    title: string;
    description: string;
    city: { name: string; slug: string };
    vibe: string;
    bestTime: string;
    peaceScore: number;
    images?: string[];
    distanceMeters: number;
    distanceKm: number;
    categories?: string[];
    address?: string;
    crowdLevel?: string;
    activities?: string[];
    location?: { type: string; coordinates: [number, number] };
}

interface NearbyResponse {
    spots: NearbySpot[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasMore: boolean;
    };
}

interface UseNearbySpotsOptions {
    lat: number;
    lng: number;
    radius?: number;
    limit?: number;
    enabled?: boolean;
}

export function useNearbySpots({ lat, lng, radius = 15, limit = 12, enabled = true }: UseNearbySpotsOptions) {
    return useQuery({
        queryKey: ['nearby-spots', lat, lng, radius],
        queryFn: async () => {
            const res = await api.get('/spots/nearby', {
                params: { lat, lng, radius, limit },
            });
            return res.data.data as NearbyResponse;
        },
        select: (data) => data.spots,
        enabled: enabled && lat !== null && lng !== null,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function formatDistance(km: number): string {
    if (km < 1) {
        return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
}
