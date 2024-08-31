import axios, { AxiosRequestConfig } from 'axios';

const apiClient = axios.create({
    baseURL: process.env.BACKEND_URI,
    timeout: 10000,
});

export const ApiClient = {
    get: async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.get(endpoint, config);
        return response.data;
    },
    post: async <T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<T> => {
        const response = await apiClient.post(endpoint, data, config);
        return response.data;
    },
};