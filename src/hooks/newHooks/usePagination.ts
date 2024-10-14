import { useMutation, useQueryClient, UseMutationResult } from 'react-query';
import { ApiClient } from '../../services/ApiClient';
import { PaginatedData } from '../../data/PaginatedData.ts';

type InferPaginatedData<T> = T extends PaginatedData<unknown> ? T : PaginatedData<T>;

const fetchPaginatedData = async <T>(
    endpoint: string,
    page: number,
    limit: number,
    creatorId?: string,
    searches?: Record<string, string[]>, // Adaptamos para múltiples búsquedas
    extraParams?: Record<string, string>
): Promise<InferPaginatedData<T>> => {
    const searchQueryString = searches
        ? Object.entries(searches)
            .map(([searchKey, searchValues]) => {
                const searchFieldsQuery = searchValues.join(',');
                return `${searchKey}=${encodeURIComponent(searchFieldsQuery)}&${searchKey}fields=${encodeURIComponent(searchValues.join(','))}`;
            })
            .join('&')
        : '';

    const extraQueryString = extraParams
        ? '&' + new URLSearchParams(extraParams).toString()
        : '';

    const queryString = `?page=${page}&limit=${limit}`
        + (creatorId ? `&creatorId=${creatorId}` : '')
        + (searchQueryString ? `&${searchQueryString}` : '')
        + extraQueryString;

    return ApiClient.get<InferPaginatedData<T>>(`${endpoint}/paginate${queryString}`);
};

export const usePagination = <T>(
    endpoint: string,
    page: number,
    limit: number,
    creatorId?: string,
    searches?: Record<string, string[]>, // Adaptamos para múltiples búsquedas
    extraParams?: Record<string, string>
): UseMutationResult<InferPaginatedData<T>, Error, void> & { resetQueries: () => void } => {

    const queryClient = useQueryClient();

    const mutationResult = useMutation<InferPaginatedData<T>, Error, void>(
        async () => await fetchPaginatedData<T>(endpoint, page, limit, creatorId, searches, extraParams),
        {
            onSuccess: (data) => {
                queryClient.setQueryData([endpoint, page, limit, creatorId, searches, extraParams], data);
            }
        }
    );

    const resetQueries = () => {
        queryClient.invalidateQueries([endpoint, page, limit, creatorId, searches, extraParams]);
    };

    return { ...mutationResult, resetQueries };
};