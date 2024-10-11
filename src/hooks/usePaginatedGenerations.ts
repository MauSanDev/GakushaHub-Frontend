import { usePaginatedData } from './usePaginatedData.ts';
import { GeneratedData } from '../data/GenerationData.ts';
import { useAuth } from "../context/AuthContext.tsx";

export const usePaginatedGenerations = (
    page: number,
    limit: number,
    keyword?: string  
) => {
    const { userData } = useAuth();
    
    const extraParams: Record<string, string> = {};

    if (keyword) {
        extraParams['keyword'] = keyword;  
    }

    const mutation = usePaginatedData<GeneratedData>(
        '/api/generation/paginated',
        page,
        limit,
        userData?._id,
        extraParams  
    );

    return {
        ...mutation,
        fetchGenerations: mutation.mutate,
    };
};