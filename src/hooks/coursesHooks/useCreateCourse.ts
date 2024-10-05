import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../services/ApiClient';
import { useAuth } from "../../context/AuthContext.tsx";
import { MY_COURSES_ENDPOINT } from "./useOwnerCourses.ts";
import { GET_COURSE_BY_ID_ENDPOINT } from "./useCourseById.ts";

const CREATE_COURSE_ENDPOINT = '/api/course/createEmptyCourse';

const createEmptyCourse = async (courseName: string, creatorId: string): Promise<any> => {
    return await ApiClient.post(CREATE_COURSE_ENDPOINT, { courseName, creatorId });
};

export const useCreateCourse = () => {
    const { userData } = useAuth();
    const queryClient = useQueryClient();

    return useMutation(async (courseName: string) => {
        if (!userData || !userData._id) {
            throw new Error("User data not available");
        }

        return await createEmptyCourse(courseName, userData._id);
    }, {
        onSuccess: (course) => {
            // Invalidating the courses queries to refresh the list
            queryClient.invalidateQueries(MY_COURSES_ENDPOINT);
            queryClient.invalidateQueries(GET_COURSE_BY_ID_ENDPOINT + course._id);
        },
        onError: (error) => {
            console.error("Error creating course:", error);
        }
    });
};