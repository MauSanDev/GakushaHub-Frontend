import { useMutation, useQueryClient, UseMutationResult } from 'react-query';
import { ApiClient } from '../../services/ApiClient';
import { PaginatedData } from '../../data/PaginatedData.ts';

type InferPaginatedData<T> = T extends PaginatedData<unknown> ? T : PaginatedData<T>;

const fetchPaginatedData = async <T>(
    endpoint: string,
    page: number,
    limit: number,
    creatorId?: string,
    search?: string,
    searchFields?: string[],
    extraParams?: Record<string, string>
): Promise<InferPaginatedData<T>> => {

    const searchFieldsQuery = searchFields ? searchFields.join(',') : '';

    const extraQueryString = extraParams
        ? '&' + new URLSearchParams(extraParams).toString()
        : '';

    const queryString = `?page=${page}&limit=${limit}`
        + (creatorId ? `&creatorId=${creatorId}` : '')
        + (search ? `&search=${encodeURIComponent(search)}` : '')
        + (searchFieldsQuery ? `&searchFields=${encodeURIComponent(searchFieldsQuery)}` : '')
        + extraQueryString;

    return ApiClient.get<InferPaginatedData<T>>(`${endpoint}/paginate${queryString}`);
};

export const usePagination = <T>(
    endpoint: string,
    page: number,
    limit: number,
    creatorId?: string,
    search?: string,
    searchFields?: string[],
    extraParams?: Record<string, string>
): UseMutationResult<InferPaginatedData<T>, Error, void> & { resetQueries: () => void } => {

    const queryClient = useQueryClient();

    const mutationResult = useMutation<InferPaginatedData<T>, Error, void>(
        async () => await fetchPaginatedData<T>(endpoint, page, limit, creatorId, search, searchFields, extraParams),
        {
            onSuccess: (data) => {
                // Cache the result using queryClient
                queryClient.setQueryData([endpoint, page, limit, creatorId, search, searchFields, extraParams], data);
            }
        }
    );

    const resetQueries = () => {
        queryClient.invalidateQueries([endpoint, page, limit, creatorId, search, searchFields, extraParams]);
    };

    return { ...mutationResult, resetQueries };
};