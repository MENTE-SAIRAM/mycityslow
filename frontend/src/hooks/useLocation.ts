import { useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';

export interface LocationState {
    lat: number | null;
    lng: number | null;
    loading: boolean;
    error: string | null;
    permissionDenied: boolean;
}

export function useLocation() {
    const [state, setState] = useState<LocationState>({
        lat: null,
        lng: null,
        loading: false,
        error: null,
        permissionDenied: false,
    });
    const { setSavedLocation } = useAppStore();

    const detectLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setState(prev => ({ ...prev, error: 'Geolocation is not supported by your browser', permissionDenied: true }));
            return;
        }

        setState({ lat: null, lng: null, loading: true, error: null, permissionDenied: false });

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setState({
                    lat: latitude,
                    lng: longitude,
                    loading: false,
                    error: null,
                    permissionDenied: false,
                });
                setSavedLocation({
                    lat: latitude,
                    lng: longitude,
                    detectedAt: new Date().toISOString(),
                });
            },
            (error) => {
                let message = 'Unable to retrieve your location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = 'Location permission denied. Please enable location access in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        message = 'Location request timed out. Please try again.';
                        break;
                }
                setState({
                    lat: null,
                    lng: null,
                    loading: false,
                    error: message,
                    permissionDenied: error.code === error.PERMISSION_DENIED,
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 300000, // 5 minutes
            }
        );
    }, [setSavedLocation]);

    const clearLocation = useCallback(() => {
        setState({ lat: null, lng: null, loading: false, error: null, permissionDenied: false });
        setSavedLocation(null);
    }, [setSavedLocation]);

    const retry = useCallback(() => {
        setState({ lat: null, lng: null, loading: false, error: null, permissionDenied: false });
        detectLocation();
    }, [detectLocation]);

    return { ...state, detectLocation, clearLocation, retry };
}
