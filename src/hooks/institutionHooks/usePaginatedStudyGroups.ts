import { useFullPagination } from '../newHooks/useFullPagination.ts';
import { StudyGroupData } from '../../data/Institutions/StudyGroupData.ts';

export const usePaginatedStudyGroups = (
    page: number,
    limit: number,
    institutionId: string,
    searchQuery?: string
) => {
    const searches: Record<string, string[]> = {};
    const extraParams: Record<string, string> = { institutionId };
    
    if (searchQuery) {
        searches['search1'] = [searchQuery];
        searches['search1fields'] = ['name', 'description']; 
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