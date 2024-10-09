import { usePaginatedData } from '../usePaginatedData.ts';
import { StudyGroupData } from '../../data/Institutions/StudyGroupData.ts';
import { useAuth } from "../../context/AuthContext.tsx";

export const usePaginatedStudyGroups = (page: number, limit: number, institutionId: string) => {
    const { userData } = useAuth();

    const { data, error, isLoading, refetch, resetQueries } = usePaginatedData<StudyGroupData>(
        '/api/institution/studyGroup/list',
        page,
        limit,
        userData?._id,  
        { institutionId }  
    );

    return { data, error, isLoading, refetch, resetQueries };
};