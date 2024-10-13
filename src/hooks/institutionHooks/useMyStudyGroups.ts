import { useFullPagination } from '../../hooks/newHooks/useFullPagination'; 
import { StudyGroupData } from '../../data/Institutions/StudyGroupData.ts';

export const useMyStudyGroups = (
    page: number,
    limit: number,
    keyword?: string
) => {
    const extraParams: Record<string, string> = {};

    if (keyword) {
        extraParams['keyword'] = keyword;
    }

    const { mutate, isLoading, data, resetQueries } = useFullPagination<StudyGroupData>(
        page,
        limit,
        'studyGroup',  
        keyword || '',  
        ['name', 'description'],  
        extraParams  
    );

    return {
        data,
        isLoading,
        resetQueries,
        fetchStudyGroups: mutate, 
    };
};