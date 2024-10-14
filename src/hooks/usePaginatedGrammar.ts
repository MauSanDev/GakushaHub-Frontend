import { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { fetchFullPagination } from '../services/dataService.ts';
import { GrammarData } from '../data/GrammarData';
import {PaginatedData} from "../data/PaginatedData.ts";

export const usePaginatedGrammar = (
    page: number,
    limit: number,
    keyword?: string,
    jlptLevel?: number
) => {
    const queryClient = useQueryClient();

    // Estado para manejar loading y datos
    const [data, setData] = useState<PaginatedData<GrammarData> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Variables iniciales
    const searches: Record<string, string[]> = {};
    const extraParams: Record<string, string> = {};

    // Configurar búsquedas y parámetros adicionales
    if (keyword) {
        searches['search1'] = [keyword];
        searches['search1fields'] = ['structure', 'keywords'];
    }

    if (jlptLevel && jlptLevel !== -1) {
        extraParams['jlpt'] = jlptLevel.toString();
    }

    // Función para buscar los datos de gramática paginados
    const fetchGrammarData = async () => {
        setIsLoading(true);
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
        } catch (error) {
            console.error('Error fetching grammar data:', error);
            setData(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGrammarData();
    }, [page, limit, keyword, jlptLevel]);

    return {
        data,
        isLoading,
        resetQueries: () => queryClient.invalidateQueries('grammar'),
        fetchGrammarData,
    };
};