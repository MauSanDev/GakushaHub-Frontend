import { useMutation, useQueryClient, UseMutationResult } from 'react-query';
import { ApiClient } from '../../../services/ApiClient';
import { CourseData } from '../../../data/CourseData';

const fetchCoursesByIds = async (ids: string[]): Promise<Record<string, CourseData>> => {
    const idsParam = ids.join(',');
    console.log("Fetching courses for IDs:", idsParam);  
    return ApiClient.get<Record<string, CourseData>>(`/api/course/get/${idsParam}`);
};

export const useCourses = (
    ids: string[]
): UseMutationResult<Record<string, CourseData>, Error, string[]> & { resetQueries: () => void } => {
    const queryClient = useQueryClient();

    const mutationResult = useMutation<Record<string, CourseData>, Error, string[]>(
        async (ids) => {
            const cachedData: Record<string, CourseData> = {};
            const idsToFetch: string[] = [];

            console.log("Received IDs for fetching:", ids);  
            ids.forEach(id => {
                const cachedCourse = queryClient.getQueryData<CourseData>(['course', id]);
                if (cachedCourse) {
                    console.log(`Course with ID ${id} found in cache`);
                    cachedData[id] = cachedCourse;  
                } else {
                    console.log(`Course with ID ${id} not found in cache, adding to fetch list`);
                    idsToFetch.push(id);  
                }
            });

            
            if (idsToFetch.length === 0) {
                console.log("All courses found in cache, no need to fetch");
                return cachedData;
            }

            
            console.log("Fetching courses for IDs:", idsToFetch);
            const fetchedData = await fetchCoursesByIds(idsToFetch);

            
            Object.entries(fetchedData).forEach(([id, course]) => {
                console.log(`Caching course with ID ${id}`);
                queryClient.setQueryData(['course', id], course);
                cachedData[id] = course;
            });

            return cachedData;
        },
        {
            onSuccess: (data) => {
                console.log("Mutation successful, caching result for course IDs:", ids);
                queryClient.setQueryData(['coursesByIds', ids], data);
            }
        }
    );

    const resetQueries = () => {
        console.log("Invalidating queries for course IDs:", ids);
        queryClient.invalidateQueries(['coursesByIds', ids]);
    };

    return { ...mutationResult, resetQueries };
};