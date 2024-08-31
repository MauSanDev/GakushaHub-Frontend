import { usePaginatedData } from './usePaginatedData.ts';
import { GeneratedData } from '../data/GenerationData.ts';

export const usePaginatedGenerations = (page: number, limit: number) => {
    return usePaginatedData<GeneratedData>('/api/generation/paginated', page, limit);
};