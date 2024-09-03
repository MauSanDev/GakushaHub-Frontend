import { useQuery, UseQueryResult } from 'react-query';
import { ApiClient } from '../services/ApiClient';
import { PaginatedData } from '../data/PaginatedData.ts';
import {useAuth} from "../context/AuthContext.tsx";

type InferPaginatedData<T> = T extends PaginatedData<unknown> ? T : PaginatedData<T>;

const fetchPaginatedData = async <T>(endpoint: string, page: number, limit: number, creatorId: string): Promise<InferPaginatedData<T>> => {
    return ApiClient.get<InferPaginatedData<T>>(`${endpoint}?page=${page}&limit=${limit}&creatorId=${creatorId}`);
};

export const usePaginatedData = <T>(endpoint: string, page: number, limit: number):
UseQueryResult<InferPaginatedData<T>, Error> => {
    const { userData} = useAuth();
    

    console.log(userData)
    if (!userData || !userData._id)
    {
        throw new Error("Pagination data not available");
    }
    
    return useQuery<InferPaginatedData<T>, Error>(
        [endpoint, page, limit],
        () => fetchPaginatedData<T>(endpoint, page, limit, userData?._id ?? ''),
        {
            keepPreviousData: true,
            staleTime: 5 * 60 * 1000,
        }
    );
};