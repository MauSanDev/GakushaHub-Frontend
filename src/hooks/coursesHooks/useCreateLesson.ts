import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from "../../context/AuthContext.tsx";
import { createElement } from '../../services/dataService';
import { CollectionTypes } from "../../data/CollectionTypes.tsx";
import {LessonData} from "../../data/CourseData.ts";

interface CreateLessonPayload {
    courseId: string;
    name: string;
    creatorId: string;
}

const createEmptyLesson = async ({ courseId, name, creatorId }: CreateLessonPayload): Promise<LessonData> => {
    const data: Record<string, unknown> = {
        courseId,
        name,
        creatorId,
    };

    return await createElement(CollectionTypes.Lesson, data) as LessonData;
};

export const useCreateLesson = () => {
    const { userData } = useAuth();
    const queryClient = useQueryClient();

    return useMutation(
        async ({ courseId, lessonName }: { courseId: string; lessonName: string }) => {
            // Validación: Verifica si el nombre de la lección está presente
            if (!lessonName || lessonName.trim() === '') {
                throw new Error("Lesson name is required");
            }

            // Verifica si la información del usuario está disponible
            if (!userData || !userData._id) {
                throw new Error("User data not available");
            }

            return await createEmptyLesson({
                courseId,
                name: lessonName,
                creatorId: userData._id,
            });
        },
        {
            onSuccess: () => {
                // Invalida las queries relacionadas para refrescar los datos si es necesario
                queryClient.invalidateQueries('lessons'); // Cambia 'lessons' por el endpoint o key correcto si es necesario
            },
            onError: (error) => {
                console.error("Error creating lesson:", error);
            },
        }
    );
};