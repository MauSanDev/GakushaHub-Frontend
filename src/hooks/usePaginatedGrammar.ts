import { usePaginatedData } from './usePaginatedData.ts';
import { GrammarData } from '../data/GrammarData.ts';
import { useAuth } from "../context/AuthContext.tsx";

export const usePaginatedGrammar = (
    page: number,
    limit: number,
    keyword?: string,
    jlptLevels?: number[]  // Array de niveles de JLPT
) => {
    const { userData } = useAuth();

    // Genera los parámetros extra a partir de los inputs
    const extraParams: Record<string, string> = {};

    if (keyword) {
        extraParams['keyword'] = keyword;
    }

    if (jlptLevels && jlptLevels.length > 0) {
        extraParams['jlptLevels'] = jlptLevels.join(',');  // Lo convertimos a string separado por comas
    }

    // Pasamos los parámetros adicionales al hook de paginación
    const mutation = usePaginatedData<GrammarData>(
        '/api/grammar/paginated',
        page,
        limit,
        userData?._id,
        extraParams
    );

    return {
        ...mutation,
        fetchGrammarData: mutation.mutate,  // Alias para llamar la mutación manualmente
    };
};