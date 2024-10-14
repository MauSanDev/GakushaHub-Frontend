import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../services/ApiClient';
import { useAuth } from "../../context/AuthContext.tsx";
import { MY_COURSES_ENDPOINT } from "./useOwnerCourses.ts";
import { CourseData } from "../../data/CourseData.ts";

interface CreateCoursePayload {
    courseName: string;
    creatorId: string;
    institutionId?: string;
}

const CREATE_COURSE_ENDPOINT = '/api/course/createEmptyCourse';

const createEmptyCourse = async ({
                                     courseName,
                                     creatorId,
                                     institutionId
                                 }: CreateCoursePayload): Promise<CourseData> => {
    const data: CreateCoursePayload = {
        courseName,
        creatorId,
    };

    if (institutionId) {
        data.institutionId = institutionId;
    }

    return await ApiClient.post<CourseData, {}>(CREATE_COURSE_ENDPOINT, data);
};

export const useCreateCourse = () => {
    const { userData } = useAuth();
    const queryClient = useQueryClient();

    return useMutation(
        // Cambiamos la firma para aceptar un objeto con courseName e institutionId
        async ({ courseName, institutionId }: { courseName: string; institutionId?: string }) => {
            if (!userData || !userData._id) {
                throw new Error("User data not available");
            }

            return await createEmptyCourse({
                courseName,
                creatorId: userData._id,
                institutionId
            });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(MY_COURSES_ENDPOINT);
            },
            onError: (error) => {
                console.error("Error creating course:", error);
            }
        }
    );
};