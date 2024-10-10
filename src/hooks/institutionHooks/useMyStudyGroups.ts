import { useQuery } from 'react-query';
import { StudyGroupData } from '../../data/Institutions/StudyGroupData.ts';
import { ApiClient } from '../../services/ApiClient';

export const useMyStudyGroups = (userId: string) => {
    const fetchMyStudyGroups = async () => {
        return await ApiClient.get<StudyGroupData[]>(`/api/institution/studyGroup/myGroups`);
    };

    const { data, error, isLoading, refetch } = useQuery<StudyGroupData[]>(
        ['myStudyGroups', userId],
        fetchMyStudyGroups,
        {
            enabled: !!userId,
            staleTime: 5 * 60 * 1000,  // Cache duration
            cacheTime: 10 * 60 * 1000, // Cache duration
        }
    );

    return { data, error, isLoading, refetch };
};