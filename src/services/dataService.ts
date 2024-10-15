import { QueryClient } from 'react-query';
import { ApiClient } from './ApiClient';
import {PaginatedData} from "../data/PaginatedData.ts";
import {CollectionTypes} from "../data/CollectionTypes.tsx";

type InferPaginatedData<T> = T extends PaginatedData<unknown> ? T : PaginatedData<T>;

export const createElement = async (
    collection: string,
    data: Record<string, unknown>
): Promise<unknown> => {
    console.log(`Creating new element in ${collection}`);
    try {
        const response = await ApiClient.post<unknown, unknown>(`api/${collection}/create`, data);
        console.log("Element created successfully:", response);
        return response;
    } catch (error) {
        console.error(`Error creating element in ${collection}`, error);
        throw error;
    }
};

export const fetchPaginatedData = async <T>(
    endpoint: string,
    page: number,
    limit: number,
    queryClient: QueryClient,
    creatorId?: string,
    searches?: Record<string, string[]>,
    extraParams?: Record<string, string>
): Promise<InferPaginatedData<T>> => {
    const queryKey = [endpoint, page, limit, creatorId, searches, extraParams];

    const cachedData = queryClient.getQueryData<InferPaginatedData<T>>(queryKey);
    if (cachedData) {
        console.log('Returning cached data for query:', queryKey);
        return cachedData;
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

    const extraQueryString = extraParams
        ? '&' + new URLSearchParams(extraParams).toString()
        : '';

    const queryString = `?page=${page}&limit=${limit}`
        + (creatorId ? `&creatorId=${creatorId}` : '')
        + (searchQueryString ? `&${searchQueryString}` : '')
        + extraQueryString;

    const fetchedData = await ApiClient.get<InferPaginatedData<T>>(`${endpoint}/paginate${queryString}`);

    queryClient.setQueryData(queryKey, fetchedData);

    return fetchedData;
};

export const fetchFullPagination = async <T>(
    page: number,
    limit: number,
    key: string,
    queryClient: QueryClient,
    searches: Record<string, string[]> = {},
    extraParams?: Record<string, string>,
    creatorId?: string
): Promise<PaginatedData<T> | undefined> => {
    try {
        const paginatedData = await fetchPaginatedData<string>(
            `api/${key}`,
            page,
            limit,
            queryClient,
            creatorId,
            searches,
            extraParams
        );

        console.log('Paginated data received:', paginatedData);
        
        if (paginatedData?.documents && paginatedData.documents.length > 0) {
            console.log(`Fetching full ${key} for IDs:`, paginatedData.documents);
            
            const elementsData = await fetchElements<T>(paginatedData.documents, key, queryClient);
            
            const combinedData: PaginatedData<T> = {
                ...paginatedData,
                documents: paginatedData.documents.map(id => elementsData[id])
            };

            return combinedData;
        } else {
            console.log(`No IDs found to fetch ${key}.`);
            return undefined;
        }
    } catch (error) {
        console.error('Error fetching full pagination:', error);
        return undefined;
    }
};

export const resetPaginationQueries = (key: string, queryClient: QueryClient) => {
    console.log(`Invalidating queries for pagination of ${key}`);
    queryClient.invalidateQueries([key]);
};

const fetchElementsByIds = async <T>(ids: string[], key: string, fields?: string[]): Promise<Record<string, Partial<T>>> => {
    const idsParam = ids.join(',');
    const fieldsParam = fields ? `?fields=${fields.join(',')}` : '';
    console.log(`Fetching ${key} for IDs: ${idsParam}, with fields: ${fields || 'full'}`);
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

    console.log(`Received IDs for fetching ${key}:`, ids);

    ids.forEach(id => {
        const cachedElement = queryClient.getQueryData<Partial<T>>([key, id]);

        if (cachedElement) {
            
            const missingFields = fields && fields.some(field => !(field in cachedElement));
            if (!missingFields) {
                console.log(`${key} with ID ${id} found in cache and has all required fields`);
                cachedData[id] = cachedElement as T;  
            } else {
                console.log(`${key} with ID ${id} missing some fields, adding to fetch list`);
                idsToFetch.push(id);
            }
        } else {
            console.log(`${key} with ID ${id} not found in cache, adding to fetch list`);
            idsToFetch.push(id);  
        }
    });
    
    if (idsToFetch.length === 0) {
        console.log(`All ${key} found in cache with required fields, no need to fetch`);
        return cachedData;
    }
    
    console.log(`Fetching ${key} for IDs:`, idsToFetch);
    const fetchedData = await fetchElementsByIds<T>(idsToFetch, key, fields);
    
    Object.entries(fetchedData).forEach(([id, fetchedElement]) => {
        const cachedElement = cachedData[id] || {};
        const updatedElement = { ...cachedElement, ...fetchedElement };  
        console.log(`Updating cache for ${key} with ID ${id}`);

        
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
    console.log(`Updating document with ID: ${documentId} at ${collection}`);
    try {
        // Realizamos la petición UPDATE
        const response = await ApiClient.put<unknown, unknown>(`api/${collection}/update/${documentId}`, data);
        console.log("Document updated successfully:", response);

        // Actualizamos la cache con la nueva data
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
    value: string,
    action: 'add' | 'remove',
    queryClient: QueryClient
): Promise<void> => {
    const updateDataPayload = action === 'add'
        ? { $addToSet: { [field]: value } }
        : { $pull: { [field]: value } };

    try {
        await updateData(collection, documentId, updateDataPayload, queryClient);
        console.log(`${action === 'add' ? 'Added' : 'Removed'} ${value} from ${field} in ${collection} with ID: ${documentId}`);
    } catch (error) {
        console.error(`Error modifying list in ${collection} with ID: ${documentId}`, error);
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

        // Realizamos la petición DELETE
        const response = await ApiClient.delete<{ message: string }>(`/api/${elementType}/delete`, {
            data: requestData
        });

        console.log(`Successfully deleted elements from ${elementType}:`, elementIds);

        // Invalidamos la cache de cada ID eliminado
        elementIds.forEach(id => {
            queryClient.removeQueries([elementType, id]);
        });

        // Invalidamos las queries de paginación relacionadas
        queryClient.invalidateQueries([elementType]);

        return response.message;
    } catch (error) {
        console.error(`Error deleting elements from ${elementType}:`, error);
        throw error;
    }
};