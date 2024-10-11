import { usePaginatedData } from '../usePaginatedData.ts';
import { StudyGroupData } from '../../data/Institutions/StudyGroupData.ts';
import { useAuth } from "../../context/AuthContext.tsx";

export const usePaginatedStudyGroups = (page: number, limit: number, institutionId: string, searchQuery?: string) => {
    const { userData } = useAuth();
    
    const extraParams: Record<string, string> = { institutionId };

    if (searchQuery) {
        extraParams['searchQuery'] = searchQuery; 
    }

    const mutation = usePaginatedData<StudyGroupData>(
        '/api/institution/studyGroup/list',
        page,
        limit,
        userData?._id,  
        extraParams  
    );

    return {
        ...mutation,
        fetchStudyGroups: mutation.mutate,
    };
};