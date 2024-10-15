import {QueryClient, useMutation, useQueryClient} from 'react-query';
import { useAuth } from "../../context/AuthContext.tsx";
import { createElement } from '../../services/dataService';
import { CollectionTypes } from "../../data/CollectionTypes.tsx";
import {LessonData} from "../../data/CourseData.ts";

interface CreateLessonPayload {
    courseId: string;
    name: string;
    creatorId: string;
}

const createEmptyLesson = async ({ courseId, name, creatorId }: CreateLessonPayload, queryClient: QueryClient): Promise<LessonData> => {
    const data: Record<string, unknown> = {
        courseId,
        name,
        creatorId,
    };

    return await createElement(CollectionTypes.Lesson, data, queryClient) as LessonData;
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
            }, queryClient);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('lessons');
            },
            onError: (error) => {
                console.error("Error creating lesson:", error);
            },
        }
    );
};