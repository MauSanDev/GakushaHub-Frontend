import { useFullPagination } from '../newHooks/useFullPagination.ts';
import { StudyGroupData } from '../../data/Institutions/StudyGroupData.ts';
import { useAuth } from "../../context/AuthContext.tsx";

export const useMyStudyGroups = (
    page: number,
    limit: number,
    keyword?: string
) => {
    const { memberships } = useAuth();

    const searches: Record<string, string[]> = {};
    const extraParams: Record<string, string> = {};

    if (keyword) {
        searches['search1'] = [keyword];
        searches['search1fields'] = ['name', 'description'];  
    }
    
    if (memberships && memberships.length > 0) {
        const institutionIds = memberships.map(m => m.institutionId);
        const membershipIds = memberships.map(m => m._id);
        
        searches['search2'] = institutionIds;
        searches['search2fields'] = ['institutionId'];
        
        searches['search3'] = membershipIds;
        searches['search3fields'] = ['memberIds'];
    }

    const { mutate, isLoading, data, resetQueries } = useFullPagination<StudyGroupData>(
        page,
        limit,
        'studyGroup',
        searches,  
        extraParams 
    );

    return {
        data,
        isLoading,
        resetQueries,
        fetchStudyGroups: mutate,
    };
};