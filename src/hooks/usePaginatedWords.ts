import { usePaginatedData } from './usePaginatedData.ts';
import { WordData } from '../data/WordData';

export const usePaginatedWords = (page: number, limit: number) => {
    return usePaginatedData<WordData>('/api/words/paginated', page, limit);
};