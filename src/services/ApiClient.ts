import axios, { AxiosRequestConfig } from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BACKEND_URI,
    timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers["Content-Type"] = "application/json";
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const ApiClient = {
    get: async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
        try {
            const response = await apiClient.get(endpoint, config);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
                } else if (error.request) {
                    throw new Error('No response received from the server.');
                } else {
                    throw new Error(`Request error: ${error.message}`);
                }
            } else {
                throw new Error('An unexpected error occurred.');
            }
        }
    },
    post: async <T, D>(endpoint: string, data: D, config?: AxiosRequestConfig): Promise<T> => {
        try {
            const response = await apiClient.post<T>(endpoint, data, config);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
                } else if (error.request) {
                    throw new Error('No response received from the server.');
                } else {
                    throw new Error(`Request error: ${error.message}`);
                }
            } else {
                throw new Error('An unexpected error occurred.');
            }
        }
    },
    put: async <T, D>(endpoint: string, data: D, config?: AxiosRequestConfig): Promise<T> => {
        try {
            const response = await apiClient.put<T>(endpoint, data, config);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
                } else if (error.request) {
                    throw new Error('No response received from the server.');
                } else {
                    throw new Error(`Request error: ${error.message}`);
                }
            } else {
                throw new Error('An unexpected error occurred.');
            }
        }
    },
    delete: async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
        try {
            const response = await apiClient.delete<T>(endpoint, config);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
                } else if (error.request) {
                    throw new Error('No response received from the server.');
                } else {
                    throw new Error(`Request error: ${error.message}`);
                }
            } else {
                throw new Error('An unexpected error occurred.');
            }
        }
    },
};