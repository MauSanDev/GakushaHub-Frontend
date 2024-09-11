import { useQuery } from 'react-query';
import { CourseData } from "../../data/CourseData.ts";
import { ApiClient } from "../../services/ApiClient.ts";

export const GET_COURSE_BY_ID_ENDPOINT = `/api/course/courses/`;

export const useCourseById = (courseId: string) => {
    return useQuery<CourseData, Error>(['course', courseId], async () => {
        const data = await ApiClient.get<CourseData>(GET_COURSE_BY_ID_ENDPOINT + courseId);
        if (!data) {
            throw new Error('Course not found');
        }
        return data;
    }, {
        retry: false,  
        refetchOnWindowFocus: false  
    });
};