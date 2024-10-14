import { useFullPagination } from './newHooks/useFullPagination';
import { GrammarData } from '../data/GrammarData.ts';

export const usePaginatedGrammar = (
    page: number,
    limit: number,
    keyword?: string,
    jlptLevel?: number
) => {
    const searches: Record<string, string[]> = {};
    
    if (keyword) {
        searches['search1'] = [keyword];  
        searches['search1fields'] = ['structure', 'keywords'];  
    }

    const extraParams: Record<string, string> = {};

    if (jlptLevel && jlptLevel !== -1) {
        extraParams['jlpt'] = jlptLevel.toString();
    }

    const { mutate, isLoading, data, resetQueries } = useFullPagination<GrammarData>(
        page,
        limit,
        'grammar',
        searches,  
        extraParams
    );

    return {
        mutate,
        isLoading,
        data,
        resetQueries,
        fetchGrammarData: mutate,
    };
};