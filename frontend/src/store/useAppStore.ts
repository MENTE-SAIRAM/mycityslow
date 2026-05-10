import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface SavedLocation {
    lat: number;
    lng: number;
    city?: string;
    detectedAt: string;
}

interface AppState {
    user: User | null;
    isDarkMode: boolean;
    savedLocation: SavedLocation | null;
    setUser: (user: User | null) => void;
    toggleDarkMode: () => void;
    setSavedLocation: (location: SavedLocation | null) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            user: null,
            isDarkMode: true, // Default to true
            savedLocation: null,
            setUser: (user) => set({ user }),
            toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
            setSavedLocation: (location) => set({ savedLocation: location }),
        }),
        {
            name: 'my-city-slow-storage',
            partialize: (state) => ({ user: state.user, isDarkMode: state.isDarkMode, savedLocation: state.savedLocation }),
        }
    )
);
