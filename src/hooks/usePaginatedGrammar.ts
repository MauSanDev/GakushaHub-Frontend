import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { fetchFullPagination } from '../services/dataService.ts';
import { GrammarData } from '../data/GrammarData';
import { PaginatedData } from "../data/PaginatedData.ts";

export const usePaginatedGrammar = () => {
    const queryClient = useQueryClient();

    const [data, setData] = useState<PaginatedData<GrammarData> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchGrammarData = async (
        page: number,
        limit: number,
        keywords?: string[],
        jlptLevel?: number
    ): Promise<PaginatedData<GrammarData> | null> => {
        setIsLoading(true);

        const searches: Record<string, string[]> = {};
        const extraParams: Record<string, string> = {};

        if (keywords) {
            searches['search1'] = keywords;
            searches['search1fields'] = ['structure', 'keywords'];
        }

        if (jlptLevel && jlptLevel !== -1) {
            extraParams['jlpt'] = jlptLevel.toString();
        }

        try {
            const result = await fetchFullPagination<GrammarData>(
                page,
                limit,
                'grammar',
                queryClient,
                searches,
                extraParams
            );
            setData(result || null);
            return result || null; // Devuelve el resultado
        } catch (error) {
            console.error('Error fetching grammar data:', error);
            setData(null);
            return null; // Devuelve null en caso de error
        } finally {
            setIsLoading(false);
        }
    };

    return {
        data,
        isLoading,
        resetQueries: () => queryClient.invalidateQueries('grammar'),
        fetchGrammarData,
    };
};