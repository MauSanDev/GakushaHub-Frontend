import { usePaginatedData } from './usePaginatedData.ts';
import { KanjiData } from '../data/KanjiData.ts';
import {useAuth} from "../context/AuthContext.tsx";

export const usePaginatedKanji = (page: number, limit: number) => {
    const { userData } = useAuth();
    return usePaginatedData<KanjiData>('/api/kanji/paginated', page, limit, userData?._id);
};