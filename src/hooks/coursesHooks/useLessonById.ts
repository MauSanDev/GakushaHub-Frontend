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
            enabled: !!lessonId, // Solo ejecuta la consulta si lessonId está presente
            refetchOnWindowFocus: false, // No hacer refetch cuando cambia el foco de la ventana
            refetchOnMount: false, // No hace refetch automáticamente al montar el componente
            refetchOnReconnect: true, // Refetch cuando hay reconexión de la red
        }
    );
};