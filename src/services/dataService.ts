import { QueryClient } from 'react-query';
import { ApiClient } from './ApiClient';
import {PaginatedData} from "../data/PaginatedData.ts";

type InferPaginatedData<T> = T extends PaginatedData<unknown> ? T : PaginatedData<T>;

const fetchPaginatedData = async <T>(
    endpoint: string,
    page: number,
    limit: number,
    creatorId?: string,
    searches?: Record<string, string[]>,
    extraParams?: Record<string, string>
): Promise<InferPaginatedData<T>> => {
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

    return ApiClient.get<InferPaginatedData<T>>(`${endpoint}/paginate${queryString}`);
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