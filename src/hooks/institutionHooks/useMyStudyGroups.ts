import {useEffect, useState} from 'react';
import {useQueryClient} from 'react-query';
import {fetchFullPagination} from '../../services/dataService.ts';
import {StudyGroupData} from '../../data/Institutions/StudyGroupData';
import {useAuth} from "../../context/AuthContext";
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
    const excludes: Record<string, string[]> = {};

    if (memberships && memberships.length > 0) {
        if (keyword) {
            searches['search1'] = [keyword];
            searches['search1fields'] = ['name', 'description'];
        }

        searches['search2'] = memberships.filter(memberships => memberships.status === 'approved').map(m => m._id);
        searches['search2fields'] = ['memberIds'];
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
                {},
                excludes,
                '',
                [],
                false,
                { createdAt: -1}
            );
            setData(result || null);
        } catch (error) {
            console.error('Error fetching study groups:', error);
            setData(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Aquí verificamos si no hay memberships para devolver una estructura vacía
    useEffect(() => {
        if (!memberships || memberships.length === 0) {
            // Si no hay memberships, devolvemos una paginación vacía
            setData({
                page,
                totalPages: 0,
                limit,
                totalDocuments: 0,
                documents: [],
            });
            setIsLoading(false);
            return;
        }

        fetchStudyGroups();
    }, [page, limit, keyword, memberships]);

    return {
        data,
        isLoading,
        resetQueries: () => queryClient.invalidateQueries('studyGroup'),
        fetchStudyGroups,
    };
};