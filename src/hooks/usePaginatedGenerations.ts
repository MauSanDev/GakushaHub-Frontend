import { useFullPagination } from './newHooks/useFullPagination';
import { GeneratedData } from '../data/GenerationData.ts';

export const usePaginatedGenerations = (
    page: number,
    limit: number,
    keyword?: string,
) => {
    const searches: Record<string, string[]> = {};
    
    if (keyword) {
        searches['search1'] = [keyword];
        searches['search1fields'] = ['title'];
    }

    const { mutate, isLoading, data, resetQueries } = useFullPagination<GeneratedData>(
        page,
        limit,
        'generation',
        searches,  
    );

    return {
        mutate,
        isLoading,
        data,
        resetQueries,
        fetchGenerations: mutate,
    };
};