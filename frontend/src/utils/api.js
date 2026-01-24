const getBaseUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${getBaseUrl()}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        if (!window.location.pathname.includes('/login')) {
            window.location.href = '/';
        }
    }

    return response;
};
