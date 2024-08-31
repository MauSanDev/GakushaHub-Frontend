import { useQuery, UseQueryResult } from 'react-query';
import { ApiClient } from '../services/ApiClient';
import { PaginatedData } from '../data/PaginatedData.ts';

type InferPaginatedData<T> = T extends PaginatedData<unknown> ? T : PaginatedData<T>;

const fetchPaginatedData = async <T>(endpoint: string, page: number, limit: number): Promise<InferPaginatedData<T>> => {
    return ApiClient.get<InferPaginatedData<T>>(`${endpoint}?page=${page}&limit=${limit}`);
};

export const usePaginatedData = <T>(
    endpoint: string,
    page: number,
    limit: number
): UseQueryResult<InferPaginatedData<T>, Error> => {
    return useQuery<InferPaginatedData<T>, Error>(
        [endpoint, page, limit],
        () => fetchPaginatedData<T>(endpoint, page, limit),
        {
            keepPreviousData: true,
            staleTime: 5 * 60 * 1000,
        }
    );
};