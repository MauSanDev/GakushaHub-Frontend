import { useFullPagination } from './newHooks/useFullPagination';
import { GeneratedData } from '../data/GenerationData.ts';

export const usePaginatedGenerations = (
    page: number,
    limit: number,
    keyword?: string,
) => {
    
    const { mutate, isLoading, data, resetQueries } = useFullPagination<GeneratedData>(
        page,
        limit,
        'generation',  
        keyword || '',  
        ['title']
    );

    return {
        mutate,
        isLoading,
        data,
        resetQueries,
        fetchGenerations: mutate,  
    };
};