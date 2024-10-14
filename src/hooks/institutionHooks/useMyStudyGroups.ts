import { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { fetchFullPagination } from '../../services/dataService.ts';
import { StudyGroupData } from '../../data/Institutions/StudyGroupData';
import { useAuth } from "../../context/AuthContext";
import {PaginatedData} from "../../data/PaginatedData.ts";

export const useMyStudyGroups = (
    page: number,
    limit: number,
    keyword?: string
) => {
    const { memberships } = useAuth();
    const queryClient = useQueryClient();

    const [data, setData] = useState<PaginatedData<StudyGroupData> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const searches: Record<string, string[]> = {};
    const extraParams: Record<string, string> = {};

    if (memberships && memberships.length > 0) {
        if (keyword) {
            searches['search1'] = [keyword];
            searches['search1fields'] = ['name', 'description'];
        }

        const institutionIds = memberships.map(m => m.institutionId);
        const membershipIds = memberships.map(m => m._id);

        searches['search2'] = institutionIds;
        searches['search2fields'] = ['institutionId'];

        searches['search3'] = membershipIds;
        searches['search3fields'] = ['memberIds'];
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
        if (memberships && memberships.length > 0) {
            fetchStudyGroups();
        }
    }, [page, limit, keyword, memberships]);

    if (!memberships || memberships.length === 0) {
        return {
            data: null,
            isLoading: false,
            resetQueries: () => {},
            fetchStudyGroups: () => {},  // Función vacía para evitar ejecución
        };
    }

    return {
        data,
        isLoading,
        resetQueries: () => queryClient.invalidateQueries('studyGroup'),
        fetchStudyGroups,
    };
};