import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../services/ApiClient';
import { useAuth } from "../../context/AuthContext.tsx";
import { GET_COURSE_BY_ID_ENDPOINT } from "./useCourseById.ts";
import { GET_LESSON_BY_ID_ENDPOINT } from "./useLessonById.ts";

const CREATE_LESSON_ENDPOINT = '/api/course/createEmptyLesson';

const createEmptyLesson = async (courseId: string, lessonName: string, creatorId: string): Promise<any> => {
    return await ApiClient.post(CREATE_LESSON_ENDPOINT, { courseId, lessonName, creatorId });
};

export const useCreateLesson = () => {
    const { userData } = useAuth();
    const queryClient = useQueryClient();

    return useMutation(async ({ courseId, lessonName }: { courseId: string, lessonName: string }) => {
        if (!userData || !userData._id) {
            throw new Error("User data not available");
        }

        return await createEmptyLesson(courseId, lessonName, userData._id);
    }, {
        onSuccess: (lesson, { courseId }) => {
            // Invalidating the course and lesson queries to refresh the list
            queryClient.invalidateQueries(GET_COURSE_BY_ID_ENDPOINT + courseId);
            queryClient.invalidateQueries(GET_LESSON_BY_ID_ENDPOINT + lesson._id);
        },
        onError: (error) => {
            console.error("Error creating lesson:", error);
        }
    });
};