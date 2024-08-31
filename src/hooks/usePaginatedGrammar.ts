import { usePaginatedData } from './usePaginatedData.ts';
import { GrammarData } from '../data/GrammarData.ts';

export const usePaginatedGrammar = (page: number, limit: number) => {
    return usePaginatedData<GrammarData>('/api/grammar/paginated', page, limit);
};