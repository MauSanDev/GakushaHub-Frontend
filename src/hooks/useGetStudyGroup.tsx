import { useQuery } from 'react-query';
import { StudyGroupData } from '../data/Institutions/StudyGroupData.ts';
import { ApiClient } from '../services/ApiClient';

export const useStudyGroupById = (studyGroupId: string) => {
    const fetchStudyGroup = async () => {
        return await ApiClient.get<StudyGroupData>(`/api/institution/studyGroup/get/${studyGroupId}`);
    };

    const { data, error, isLoading, refetch } = useQuery<StudyGroupData>(
        ['studyGroup', studyGroupId],
        fetchStudyGroup,
        {
            enabled: !!studyGroupId,
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
        }
    );

    return { data, error, isLoading, refetch };
};