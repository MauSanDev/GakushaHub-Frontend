import { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { fetchFullPagination } from '../../services/dataService.ts';
import { StudyGroupData } from '../../data/Institutions/StudyGroupData';
import {PaginatedData} from "../../data/PaginatedData.ts";

export const usePaginatedStudyGroups = (
    page: number,
    limit: number,
    institutionId: string,
    searchQuery?: string
) => {
    const queryClient = useQueryClient();
    const [data, setData] = useState<PaginatedData<StudyGroupData> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const searches: Record<string, string[]> = {};
    const extraParams: Record<string, string> = { institutionId };

    if (searchQuery) {
        searches['search1'] = [searchQuery];
        searches['search1fields'] = ['name', 'description'];
    }

    const fetchStudyGroups = async () => {
        setIsLoading(true);
        try {
            const result = await fetchFullPagination<StudyGroupData>(
                page,
                limit,
                'studyGroup',
                queryClient,
                searches,
                extraParams
            );
            setData(result || null);
        } catch (error) {
            console.error('Error fetching study groups:', error);
            setData(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudyGroups();
    }, [page, limit, searchQuery, institutionId]);

    return {
        data,
        isLoading,
        resetQueries: () => queryClient.invalidateQueries('studyGroup'),
        fetchStudyGroups,
    };
};