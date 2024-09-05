import { usePaginatedData } from './usePaginatedData.ts';
import { WordData } from '../data/WordData';
import {useAuth} from "../context/AuthContext.tsx";

export const usePaginatedWords = (page: number, limit: number) => {
    const { userData } = useAuth();
    return usePaginatedData<WordData>('/api/words/paginated', page, limit, userData?._id);
};