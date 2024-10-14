import { useFakePagination } from '../useFakePagination';
import { CourseData } from '../../../data/CourseData.ts';  

export const useStudyGroupCourses = (
    courseIds: string[],  
    page: number,         
    limit: number         
) => {
    
    const { mutate, isLoading, data, resetQueries } = useFakePagination<CourseData>(
        courseIds,  
        page,       
        limit,      
        'course',   
    );

    return {
        data,              
        isLoading,         
        resetQueries,      
        fetchStudyCourses: mutate,  
    };
};