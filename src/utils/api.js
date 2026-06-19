import axios from 'axios';

// Ambil token dari localStorage saat pertama kali load
let jwt = null;
try {
    const rawJwt = localStorage.getItem('jwt');
    if (rawJwt) {
        jwt = rawJwt.startsWith('"') ? JSON.parse(rawJwt) : rawJwt;
    }
} catch (e) {
    jwt = localStorage.getItem('jwt');
}

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': jwt ? `Bearer ${jwt}` : '',
    },
});

// ── Request interceptor ──────────────────────────────────────────────────────
// Pastikan token selalu fresh dari localStorage di setiap request
api.interceptors.request.use((config) => {
    let token = null;
    try {
        const rawToken = localStorage.getItem('jwt');
        if (rawToken) {
            token = rawToken.startsWith('"') ? JSON.parse(rawToken) : rawToken;
        }
    } catch (e) {
        token = localStorage.getItem('jwt');
    }
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// ── Response interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401) {
            // Jika 401 + "Token has expired" → coba refresh sekali
            if (
                error.response?.data?.error?.message === 'Token has expired' &&
                !originalRequest._retry
            ) {
                originalRequest._retry = true;
                try {
                    const res = await api.post('auth/refresh');
                    const newToken = res.data.token;
                    localStorage.setItem('jwt', JSON.stringify(newToken));
                    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch {
                    // Refresh gagal → logout
                    localStorage.removeItem('jwt');
                    window.location.href = '/';
                    return Promise.reject(error);
                }
            }

            // Untuk 401 lainnya (invalid, blacklisted, atau unauthenticated) → langsung logout
            localStorage.removeItem('jwt');
            window.location.href = '/';
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default api;