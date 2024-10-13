import { usePagination } from './../usePagination.ts';
import { useCourses } from './useCourses';
import { PaginatedData } from "../../../data/PaginatedData.ts";
import { CourseData } from '../../../data/CourseData.ts';
import { useAuth } from "../../../context/AuthContext.tsx";

export const useMyCourses = (
    page: number,
    limit: number,
    search: string = ''
): { mutate: () => void, isLoading: boolean, data?: PaginatedData<CourseData>, resetQueries: () => void } => {
    const { userData } = useAuth();

    
    const { mutate: paginateMutate, resetQueries: paginateResetQueries, data: paginatedData, isLoading: isPaginating } = usePagination<string>(
        'api/course', page, limit, userData?._id, search, ['name']
    );

    
    const { mutate: fetchCoursesMutate, resetQueries: coursesResetQueries, data: coursesData, isLoading: isFetchingCourses } = useCourses(paginatedData?.documents || []);

    const fetchMyCourses = () => {
        
        paginateMutate(undefined, {
            onSuccess: (paginatedData) => {
                console.log("Paginated data received:", paginatedData);  

                
                if (paginatedData?.documents && paginatedData.documents.length > 0) {
                    console.log("Fetching full courses for IDs:", paginatedData.documents);

                    fetchCoursesMutate(paginatedData.documents);
                } else {
                    console.log("No IDs found to fetch courses.");
                }
            }
        });
    };

    const resetQueries = () => {
        paginateResetQueries();
        coursesResetQueries();
    };

    
    const combinedData: PaginatedData<CourseData> | undefined = paginatedData && coursesData
        ? {
            ...paginatedData,  
            documents: paginatedData.documents.map(id => coursesData[id])  
        }
        : undefined;

    return {
        mutate: fetchMyCourses,
        isLoading: isPaginating || isFetchingCourses,  
        data: combinedData,  
        resetQueries
    };
};