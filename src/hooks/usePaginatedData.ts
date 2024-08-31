import { useQuery } from 'react-query';
import { ApiClient } from '../services/ApiClient';

interface PaginatedResponse<T> {
    page: number;
    totalPages: number;
    limit: number;
    totalDocuments: number;
    documents: T[];
}

const fetchPaginatedData = async <T>(endpoint: string, page: number, limit: number): Promise<PaginatedResponse<T>> => {
    return ApiClient<PaginatedResponse<T>>(`${endpoint}?page=${page}&limit=${limit}`);
};

export const usePaginatedData = <T>(endpoint: string, page: number, limit: number) => {
    return useQuery([endpoint, page, limit], () => fetchPaginatedData<T>(endpoint, page, limit), {
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    });
};