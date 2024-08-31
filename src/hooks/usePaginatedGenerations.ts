import { usePaginatedData } from './usePaginatedData.ts';
import { GeneratedData } from '../data/GenerationData.ts';

export const usePaginatedCourse = (page: number, limit: number) => {
    return usePaginatedData<GeneratedData>('/api/generation/paginated', page, limit);
};