import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Backend base URL
});

// Request Interceptor: add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Response Interceptor: refresh token on 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const res = await axios.post('http://localhost:3000/api/auth/refresh', { refreshToken });
                    const newToken = res.data.data.accessToken;
                    const newRefreshToken = res.data.data.refreshToken;
                    localStorage.setItem('token', newToken);
                    if (newRefreshToken) {
                        localStorage.setItem('refreshToken', newRefreshToken);
                    }
                    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (err) {
                const status = (err as any)?.response?.status;
                // Logout only when refresh token is invalid/unauthorized.
                if (status === 401 || status === 403) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
