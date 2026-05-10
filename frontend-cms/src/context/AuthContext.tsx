import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/axios';

interface AuthContextType {
    token: string | null;
    user: any;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    token: null,
    user: null,
    login: async () => { },
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('cms_token'));
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (token) {
            api.get('/auth/profile')
                .then((res) => setUser(res.data.data || res.data))
                .catch((error) => {
                    const status = error?.response?.status;
                    // Keep token if backend is temporarily unavailable.
                    if (status === 401 || status === 403) {
                        setToken(null);
                        localStorage.removeItem('cms_token');
                    }
                });
        }
    }, [token]);

    const login = async (email: string, password: string) => {
        const res = await api.post('/auth/login', { email, password });
        const data = res.data.data || res.data;

        if (data.user?.role !== 'admin') {
            throw new Error('Admin access only');
        }

        localStorage.setItem('cms_token', data.accessToken);
        localStorage.setItem('cms_refresh_token', data.refreshToken);
        setToken(data.accessToken);
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem('cms_token');
        localStorage.removeItem('cms_refresh_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
