import {QueryClient, QueryKey} from 'react-query';
import { ApiClient } from './ApiClient';
import {PaginatedData} from "../data/PaginatedData.ts";
import {CollectionTypes} from "../data/CollectionTypes.tsx";

type InferPaginatedData<T> = T extends PaginatedData<unknown> ? T : PaginatedData<T>;

export const createElement = async <T>(
    collection: string,
    data: Record<string, unknown>,
    queryClient: QueryClient
): Promise<T> => {
    try {
        const response = await ApiClient.post<T, Record<string, unknown>>(`api/${collection}/create`, data);
        
        const newElementId = (response as { _id?: string })._id;
        
        if (newElementId) {
            queryClient.setQueryData([collection, newElementId], response);
            queryClient.invalidateQueries([collection]);
        }

        return response;
    } catch (error) {
        console.error(`Error creating element in ${collection}`, error);
        throw error;
    }
};

export const fetchFullPagination = async <T>(
    page: number,
    limit: number,
    key: string,
    queryClient: QueryClient,
    searches: Record<string, string[]> = {},
    extraParams?: Record<string, string>,
    excludes?: Record<string, string[]>,
    creatorId?: string,
    fields?: string[],
    forceFetch?: boolean,
    sortingOptions?: Record<string, number>,  // Añadimos sortingOptions como parámetro
): Promise<PaginatedData<T> | undefined> => {
    try {
        const paginatedData = await fetchPaginatedData<string>(
            `api/${key}`,
            page,
            limit,
            queryClient,
            creatorId,
            searches,
            extraParams,
            excludes,
            sortingOptions,  // Pasamos sortingOptions aquí
            forceFetch
        );

        if (paginatedData?.documents && paginatedData.documents.length > 0) {
            const elementsData = await fetchElements<T>(paginatedData.documents, key, queryClient, fields);

            const combinedData: PaginatedData<T> = {
                ...paginatedData,
                documents: paginatedData.documents.map(id => elementsData[id])
            };

            return combinedData;
        } else {
            return undefined;
        }
    } catch (error) {
        console.error('Error fetching full pagination:', error);
        return undefined;
    }
};

export const fetchPaginatedData = async <T>(
    endpoint: string,
    page: number,
    limit: number,
    queryClient: QueryClient,
    creatorId?: string,
    searches?: Record<string, string[]>,
    extraParams?: Record<string, string>,
    excludes?: Record<string, string[]>,
    sortingOptions?: Record<string, number>,  // Añadimos sortingOptions como parámetro
    forceFetch?: boolean
): Promise<InferPaginatedData<T>> => {
    const queryKey = [endpoint, page, limit, creatorId, searches, extraParams, excludes, sortingOptions, forceFetch = true];

    if (forceFetch) {
        resetPaginationQueries(queryKey, queryClient);
    } else {
        const cachedData = queryClient.getQueryData<InferPaginatedData<T>>(queryKey);
        if (cachedData) {
            return cachedData;
        }
    }

    const searchQueryString = searches
        ? Object.entries(searches)
            .map(([searchKey, searchValues]) => {
                if (searchKey.endsWith('fields')) {
                    return `${searchKey}=${encodeURIComponent(searchValues.join(','))}`;
                } else {
                    return `${searchKey}=${encodeURIComponent(searchValues.join(','))}`;
                }
            })
            .join('&')
        : '';

    const excludeQueryString = excludes
        ? Object.entries(excludes)
            .map(([excludeKey, excludeValues]) => {
                if (excludeKey.endsWith('fields')) {
                    return `${excludeKey}=${encodeURIComponent(excludeValues.join(','))}`;
                } else {
                    return `${excludeKey}=${encodeURIComponent(excludeValues.join(','))}`;
                }
            })
            .join('&')
        : '';

    const extraQueryString = extraParams
        ? '&' + new URLSearchParams(extraParams).toString()
        : '';

    // Convertir sortingOptions en un query string
    const sortingQueryString = sortingOptions
        ? Object.entries(sortingOptions)
            .map(([field, order]) => `sortOptions=${field}:${order}`)
            .join('&')
        : '';

    const queryString = `?page=${page}&limit=${limit}`
        + (creatorId ? `&creatorId=${creatorId}` : '')
        + (searchQueryString ? `&${searchQueryString}` : '')
        + (excludeQueryString ? `&${excludeQueryString}` : '')
        + (sortingQueryString ? `&${sortingQueryString}` : '') // Añadimos el sortingOptions al queryString
        + extraQueryString;

    const fetchedData = await ApiClient.get<InferPaginatedData<T>>(`${endpoint}/paginate${queryString}`);

    queryClient.setQueryData(queryKey, fetchedData);

    return fetchedData;
};

export const resetPaginationQueries = (key: QueryKey, queryClient: QueryClient) => {
    console.log(`Invalidating queries for pagination of ${key}`);
    queryClient.invalidateQueries([key]);
};

const fetchElementsByIds = async <T>(ids: string[], key: string, fields?: string[]): Promise<Record<string, Partial<T>>> => {
    const idsParam = ids.join(',');
    const fieldsParam = fields ? `?fields=${fields.join(',')}` : '';
    return ApiClient.get<Record<string, Partial<T>>>(`/api/${key}/get/${idsParam}${fieldsParam}`);
};

export const fetchElements = async <T>(
    ids: string[],
    key: string,
    queryClient: QueryClient,
    fields?: string[]
): Promise<Record<string, T>> => {
    const cachedData: Record<string, T> = {};
    const idsToFetch: string[] = [];
    
    ids.forEach(id => {
        const cachedElement = queryClient.getQueryData<Partial<T>>([key, id]);

        if (cachedElement) {
            
            const missingFields = fields && fields.some(field => !(field in cachedElement));
            if (!missingFields) {
                cachedData[id] = cachedElement as T;  
            } else {
                idsToFetch.push(id);
            }
        } else {
            idsToFetch.push(id);  
        }
    });
    
    if (idsToFetch.length === 0) {
        return cachedData;
    }
    
    const fetchedData = await fetchElementsByIds<T>(idsToFetch, key, fields);
    
    Object.entries(fetchedData).forEach(([id, fetchedElement]) => {
        const cachedElement = cachedData[id] || {};
        const updatedElement = { ...cachedElement, ...fetchedElement };
        
        queryClient.setQueryData([key, id], updatedElement);
        cachedData[id] = updatedElement as T;
    });

    return cachedData;
};


export const resetCachedQueries = (ids: string[], key: string, queryClient: QueryClient) => {
    console.log(`Invalidating queries for ${key} IDs:`, ids);
    queryClient.invalidateQueries([`${key}ByIds`, ids]);
};

export const updateData = async (
    collection: string,
    documentId: string,
    data: unknown,
    queryClient: QueryClient
): Promise<unknown> => {
    try {
        
        const response = await ApiClient.put<unknown, unknown>(`api/${collection}/update/${documentId}`, data);

        queryClient.setQueryData([collection, documentId], response);

        return response;
    } catch (error) {
        console.error(`Error updating document with ID: ${documentId} at ${collection}`, error);
        throw error;
    }
};

export const updateList = async (
    collection: string,
    documentId: string,
    field: string,
    values: string[], 
    action: 'add' | 'remove',
    queryClient: QueryClient
): Promise<void> => {
    const updateDataPayload = action === 'add'
        ? { $addToSet: { [field]: { $each: values } } } 
        : { $pull: { [field]: { $in: values } } }; 

    try {
        await updateData(collection, documentId, updateDataPayload, queryClient);
    } catch (error) {
        throw error;
    }
};

export const deleteData = async (
    elementIds: string[],
    elementType: CollectionTypes,
    queryClient: QueryClient,
    deleteRelations: boolean = false,
    extraParams?: Record<string, unknown>
): Promise<string> => {
    try {
        const requestData = {
            elementIds,
            deleteRelations,
            ...extraParams
        };

        
        const response = await ApiClient.delete<{ message: string }>(`/api/${elementType}/delete`, {
            data: requestData
        });
        
        elementIds.forEach(id => {
            queryClient.removeQueries([elementType, id]);
        });

        
        queryClient.invalidateQueries([elementType]);

        return response.message;
    } catch (error) {
        throw error;
    }
};