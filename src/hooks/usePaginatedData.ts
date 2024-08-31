import { useQuery } from 'react-query';
import { ApiClient } from '../services/ApiClient';
import { PaginatedData } from '../data/PaginatedData.ts'


const fetchPaginatedData = async <T>(endpoint: string, page: number, limit: number): Promise<PaginatedData<T>> => {
    return ApiClient.get<PaginatedData<T>>(`${endpoint}?page=${page}&limit=${limit}`);
};

export const usePaginatedData = <T>(endpoint: string, page: number, limit: number) => {
    return useQuery([endpoint, page, limit], () => fetchPaginatedData<T>(endpoint, page, limit), {
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    });
};