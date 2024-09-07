import { useQuery } from 'react-query';
import { CourseData } from "../../data/CourseData.ts";
import { ApiClient } from "../../services/ApiClient.ts";

export const useCourseById = (courseId: string) => {
    return useQuery<CourseData, Error>(['course', courseId], async () => {
        const data = await ApiClient.get<CourseData>(`/api/course/courses/${courseId}`);
        return data;
    });
};