import { usePaginatedData } from './usePaginatedData.ts';
import { GrammarData } from '../data/GrammarData.ts';
import {useAuth} from "../context/AuthContext.tsx";

export const usePaginatedGrammar = (page: number, limit: number) => {
    const { userData } = useAuth();
    return usePaginatedData<GrammarData>('/api/grammar/paginated', page, limit, userData?._id);
};