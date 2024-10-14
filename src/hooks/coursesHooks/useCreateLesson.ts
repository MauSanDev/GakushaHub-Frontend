import { useMutation } from 'react-query';
import { ApiClient } from '../../services/ApiClient';
import { useAuth } from "../../context/AuthContext.tsx";

const CREATE_LESSON_ENDPOINT = '/api/course/createEmptyLesson';

const createEmptyLesson = async (courseId: string, lessonName: string, creatorId: string): Promise<any> => {
    return await ApiClient.post(CREATE_LESSON_ENDPOINT, { courseId, lessonName, creatorId });
};

export const useCreateLesson = () => {
    const { userData } = useAuth();

    return useMutation(async ({ courseId, lessonName }: { courseId: string, lessonName: string }) => {
        if (!userData || !userData._id) {
            throw new Error("User data not available");
        }

        return await createEmptyLesson(courseId, lessonName, userData._id);
    });
};