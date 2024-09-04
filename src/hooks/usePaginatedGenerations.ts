import { usePaginatedData } from './usePaginatedData.ts';
import { GeneratedData } from '../data/GenerationData.ts';

export const usePaginatedGenerations = (page: number, limit: number) => {
    const { data, error, resetQueries, ...rest } =  usePaginatedData<GeneratedData>('/api/generation/paginated', page, limit);

    return { data, error, resetQueries, ...rest };
};