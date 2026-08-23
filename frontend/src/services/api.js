const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const REQUEST_TIMEOUT_MS = 8000;

// A slow 3G connection can hang for a long time, so every request is
// aborted after REQUEST_TIMEOUT_MS instead of leaving the UI stuck forever.
async function request(path, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const body = await response.json().catch(() => null);

        if (!response.ok) {
            const message = body?.error || 'Something went wrong. Please try again.';
            const error = new Error(message);
            error.fieldErrors = body?.fieldErrors;
            error.status = response.status;
            throw error;
        }

        return body;
    } catch (err) {
        clearTimeout(timeoutId);

        if (err.name === 'AbortError') {
            throw new Error('The request timed out. Check your connection and try again.');
        }
        if (err instanceof TypeError) {
            throw new Error('Unable to reach the server. Check your connection and try again.');
        }
        throw err;
    }
}

export const propertyApi = {
    list: (params = {}) => {
        const cleanParams = {};
        Object.keys(params).forEach((key) => {
            if (params[key] !== undefined && params[key] !== '') {
                cleanParams[key] = params[key];
            }
        });
        const query = new URLSearchParams(cleanParams).toString();
        return request(`/properties${query ? `?${query}` : ''}`);
    },
    get: (id) => request(`/properties/${id}`),
    create: (payload) => request('/properties', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => request(`/properties/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    remove: (id) => request(`/properties/${id}`, { method: 'DELETE' }),
};

export const cacheApi = {
    listEntries: () => request('/cache/entries'),
    clearEntry: (key) => request(`/cache/entries/${encodeURIComponent(key)}`, { method: 'DELETE' }),
    activityLog: (limit = 50) => request(`/cache/activity?limit=${limit}`),
};

export const dashboardApi = {
    stats: () => request('/dashboard/stats'),
};
