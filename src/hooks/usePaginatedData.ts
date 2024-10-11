import { useMutation, useQueryClient, UseMutationResult } from 'react-query';
import { ApiClient } from '../services/ApiClient';
import { PaginatedData } from '../data/PaginatedData.ts';

type InferPaginatedData<T> = T extends PaginatedData<unknown> ? T : PaginatedData<T>;

const fetchPaginatedData = async <T>(
    endpoint: string,
    page: number,
    limit: number,
    creatorId: string,
    extraParams?: Record<string, string>
): Promise<InferPaginatedData<T>> => {

    const extraQueryString = extraParams
        ? '&' + new URLSearchParams(extraParams).toString()
        : '';

    return ApiClient.get<InferPaginatedData<T>>(`${endpoint}?page=${page}&limit=${limit}&creatorId=${creatorId}${extraQueryString}`);
};

export const usePaginatedData = <T>(
    endpoint: string,
    page: number,
    limit: number,
    userId?: string,
    extraParams?: Record<string, string>
): UseMutationResult<InferPaginatedData<T>, Error, void> & { resetQueries: () => void } => {

    const queryClient = useQueryClient();

    const mutationResult = useMutation<InferPaginatedData<T>, Error, void>(
        async () => await fetchPaginatedData<T>(endpoint, page, limit, userId ?? '', extraParams),
        {
            onSuccess: (data) => {
                // Cache the result using queryClient
                queryClient.setQueryData([endpoint, page, limit, extraParams], data);
            }
        }
    );

    const resetQueries = () => {
        queryClient.invalidateQueries(endpoint);
    };

    return { ...mutationResult, resetQueries };
};