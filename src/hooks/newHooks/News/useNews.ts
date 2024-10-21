import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { fetchFullPagination } from '../../../services/dataService.ts';
import { NewsData } from '../../../data/NewsData';
import { PaginatedData } from '../../../data/PaginatedData';
import { useAuth } from "../../../context/AuthContext";

export const useNews = (
    page: number,
    limit: number,
    search: string = '',
    fields: string[] = []
): { fetchNews: () => Promise<void>, isLoading: boolean, data?: PaginatedData<NewsData>, resetQueries: () => void } => {
    const { userData } = useAuth();
    const queryClient = useQueryClient();
    const [data, setData] = useState<PaginatedData<NewsData> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const searches: Record<string, string[]> = {};

    if (search) {
        searches['search1'] = [search];
        searches['search1fields'] = ['title', 'text', 'tags'];
    }

    const fetchNews = async () => {
        setIsLoading(true);
        try {
            const result = await fetchFullPagination<NewsData>(
                page,
                limit,
                'news',
                queryClient,
                searches,
                {},
                {},
                userData?._id,
                fields
            );
            setData(result);
        } catch (error) {
            console.error('Error fetching news:', error);
            setData(undefined);
        } finally {
            setIsLoading(false);
        }
    };
    
    const resetQueries = () => {
        queryClient.invalidateQueries('news');
    };

    return {
        data,
        isLoading,
        fetchNews,  
        resetQueries,  
    };
};