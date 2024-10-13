import { useMutation, useQueryClient, UseMutationResult } from 'react-query';
import { ApiClient } from '../../services/ApiClient';

const fetchElementsByIds = async <T>(ids: string[], key: string): Promise<Record<string, T>> => {
    const idsParam = ids.join(',');
    console.log(`Fetching ${key} for IDs:`, idsParam);
    return ApiClient.get<Record<string, T>>(`/api/${key}/get/${idsParam}`);
};

export const useElements = <T>(
    ids: string[],
    key: string
): UseMutationResult<Record<string, T>, Error, string[]> & { resetQueries: () => void } => {
    const queryClient = useQueryClient();

    const mutationResult = useMutation<Record<string, T>, Error, string[]>(
        async (ids) => {
            const cachedData: Record<string, T> = {};
            const idsToFetch: string[] = [];

            console.log(`Received IDs for fetching ${key}:`, ids);
            ids.forEach(id => {
                const cachedElement = queryClient.getQueryData<T>([key, id]);
                if (cachedElement) {
                    console.log(`${key} with ID ${id} found in cache`);
                    cachedData[id] = cachedElement;
                } else {
                    console.log(`${key} with ID ${id} not found in cache, adding to fetch list`);
                    idsToFetch.push(id);
                }
            });
            
            if (idsToFetch.length === 0) {
                console.log(`All ${key} found in cache, no need to fetch`);
                return cachedData;
            }
            
            console.log(`Fetching ${key} for IDs:`, idsToFetch);
            const fetchedData = await fetchElementsByIds<T>(idsToFetch, key);
            
            Object.entries(fetchedData).forEach(([id, element]) => {
                console.log(`Caching ${key} with ID ${id}`);
                queryClient.setQueryData([key, id], element);
                cachedData[id] = element;
            });

            return cachedData;
        },
        {
            onSuccess: (data) => {
                console.log(`Mutation successful, caching result for ${key} IDs:`, ids);
                queryClient.setQueryData([`${key}ByIds`, ids], data);
            }
        }
    );

    const resetQueries = () => {
        console.log(`Invalidating queries for ${key} IDs:`, ids);
        queryClient.invalidateQueries([`${key}ByIds`, ids]);
    };

    return { ...mutationResult, resetQueries };
};