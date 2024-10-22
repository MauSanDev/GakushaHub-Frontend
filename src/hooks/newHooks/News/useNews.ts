import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { fetchFullPagination } from '../../../services/dataService.ts';
import { NewsData } from '../../../data/NewsData';
import { PaginatedData } from '../../../data/PaginatedData';

export const useNews = (
    page: number,
    limit: number,
    search: string = '',
    institutionId: string = '',
    fields: string[] = []
): { fetchNews: () => Promise<void>, isLoading: boolean, data?: PaginatedData<NewsData>, resetQueries: () => void } => {
    const queryClient = useQueryClient();
    const [data, setData] = useState<PaginatedData<NewsData> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const searches: Record<string, string[]> = {};
w
    if (search) {
        searches['search1'] = [search];
        searches['search1fields'] = ['title', 'text', 'tags'];
    }

    searches['search2'] = [institutionId];
    searches['search1fields'] = ['institutionId'];

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
                '',
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