import axios, { AxiosRequestConfig } from 'axios';

const apiClient = axios.create({
    baseURL: process.env.BACKEND_URI,
    timeout: 10000,
});

export const ApiClient = async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get(endpoint, config);
    return response.data;
};