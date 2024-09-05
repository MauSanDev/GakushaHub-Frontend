import { usePaginatedData } from './usePaginatedData.ts';
import { GeneratedData } from '../data/GenerationData.ts';
import {useAuth} from "../context/AuthContext.tsx";

export const usePaginatedGenerations = (page: number, limit: number) => {
    const { userData } = useAuth();
    const { data, error, resetQueries, ...rest } =  usePaginatedData<GeneratedData>('/api/generation/paginated', page, limit, userData?._id);

    return { data, error, resetQueries, ...rest };
};