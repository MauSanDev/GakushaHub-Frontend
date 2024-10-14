import { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { fetchFullPagination } from '../services/dataService.ts';
import { GeneratedData } from '../data/GenerationData';
import {PaginatedData} from "../data/PaginatedData.ts";

export const usePaginatedGenerations = (
    page: number,
    limit: number,
    keyword?: string
) => {
    const queryClient = useQueryClient();
    const [data, setData] = useState<PaginatedData<GeneratedData> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const searches: Record<string, string[]> = {};

    if (keyword) {
        searches['search1'] = [keyword];
        searches['search1fields'] = ['title'];
    }

    const fetchGenerations = async () => {
        setIsLoading(true);
        try {
            const result = await fetchFullPagination<GeneratedData>(
                page,
                limit,
                'generation',
                queryClient,
                searches
            );
            setData(result);
        } catch (error) {
            console.error('Error fetching generations:', error);
            setData(undefined);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGenerations();
    }, [page, limit, keyword]);

    return {
        data,
        isLoading,
        resetQueries: () => queryClient.invalidateQueries('generation'),
        fetchGenerations,
    };
};