import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from "../../context/AuthContext.tsx";
import { MY_COURSES_ENDPOINT } from "./useOwnerCourses.ts";
import { CourseData } from "../../data/CourseData.ts";
import { createElement } from '../../services/dataService';
import {CollectionTypes} from "../../data/CollectionTypes.tsx";

interface CreateCoursePayload {
    name: string;
    creatorId: string;
    institutionId?: string;
}

const createEmptyCourse = async ({name, creatorId, institutionId,}: CreateCoursePayload): Promise<CourseData> => {
    const data: Record<string, unknown> = {
        name,
        creatorId,
    };

    if (institutionId) {
        data.institutionId = institutionId;
    }

    
    return await createElement(CollectionTypes.Course, data) as CourseData;
};

export const useCreateCourse = () => {
    const { userData } = useAuth();
    const queryClient = useQueryClient();

    return useMutation(
        async ({ courseName, institutionId }: { courseName: string; institutionId?: string }) => {
            
            if (!courseName || courseName.trim() === '') {
                throw new Error("Course name is required");
            }
            
            if (!userData || !userData._id) {
                throw new Error("User data not available");
            }

            return await createEmptyCourse({
                name: courseName,
                creatorId: userData._id,
                institutionId,
            });
        },
        {
            onSuccess: () => {
                
                queryClient.invalidateQueries(MY_COURSES_ENDPOINT);
            },
            onError: (error) => {
                console.error("Error creating course:", error);
            },
        }
    );
};