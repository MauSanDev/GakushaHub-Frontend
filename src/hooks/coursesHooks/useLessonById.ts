import { useQuery } from 'react-query';
import { LessonData } from "../../data/CourseData.ts";
import { ApiClient } from "../../services/ApiClient.ts";

export const GET_LESSON_BY_ID_ENDPOINT = `/api/course/lessons/`

export const useLessonById = (lessonId: string) => {
    return useQuery<LessonData, Error>(
        ['lesson', lessonId],
        async () => {
            const data = await ApiClient.get<LessonData>(GET_LESSON_BY_ID_ENDPOINT + lessonId);
            return data;
        },
        {
            enabled: !!lessonId, 
            refetchOnWindowFocus: false, 
            refetchOnMount: false, 
            refetchOnReconnect: true, 
        }
    );
};