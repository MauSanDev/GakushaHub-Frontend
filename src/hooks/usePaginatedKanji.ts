import { usePaginatedData } from './usePaginatedData.ts';
import { KanjiData } from '../data/KanjiData.ts';

export const usePaginatedKanji = (page: number, limit: number) => {
    return usePaginatedData<KanjiData>('/api/kanji/paginated', page, limit);
};