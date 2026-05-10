import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('cms_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 — redirect to login
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest?._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('cms_refresh_token');

            if (refreshToken) {
                try {
                    const res = await axios.post('/api/auth/refresh', { refreshToken });
                    const data = res.data.data || res.data;
                    const newAccessToken = data.accessToken;
                    const newRefreshToken = data.refreshToken;

                    if (newAccessToken) {
                        localStorage.setItem('cms_token', newAccessToken);
                        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    }

                    if (newRefreshToken) {
                        localStorage.setItem('cms_refresh_token', newRefreshToken);
                    }

                    return api(originalRequest);
                } catch (refreshError: any) {
                    const status = refreshError?.response?.status;
                    if (status === 401 || status === 403) {
                        localStorage.removeItem('cms_token');
                        localStorage.removeItem('cms_refresh_token');
                        window.location.href = '/login';
                    }
                    return Promise.reject(refreshError);
                }
            }
        }

        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('cms_token');
            localStorage.removeItem('cms_refresh_token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    },
);

export default api;
