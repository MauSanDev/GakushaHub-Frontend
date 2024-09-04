import { useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { ApiClient } from '../services/ApiClient';
import { PaginatedData } from '../data/PaginatedData.ts';
import { useAuth } from "../context/AuthContext.tsx";

type InferPaginatedData<T> = T extends PaginatedData<unknown> ? T : PaginatedData<T>;

const fetchPaginatedData = async <T>(endpoint: string, page: number, limit: number, creatorId: string): Promise<InferPaginatedData<T>> => {
    return ApiClient.get<InferPaginatedData<T>>(`${endpoint}?page=${page}&limit=${limit}&creatorId=${creatorId}`);
};

export const usePaginatedData = <T>(endpoint: string, page: number, limit: number):
    UseQueryResult<InferPaginatedData<T>, Error> & { resetQueries: () => void } => {
    const queryClient = useQueryClient();
    const { userData } = useAuth();

    if (!userData || !userData._id) {
        throw new Error("Pagination data not available");
    }

    const queryKey = [endpoint, page, limit];

    const queryResult = useQuery<InferPaginatedData<T>, Error>(
        queryKey,
        () => fetchPaginatedData<T>(endpoint, page, limit, userData?._id ?? ''),
        {
            keepPreviousData: true,
            staleTime: 5 * 60 * 1000,
        }
    );

    const resetQueries = () => {
        // Resetea todas las queries relacionadas con el endpoint
        queryClient.invalidateQueries(endpoint);
    };

    return { ...queryResult, resetQueries };
};