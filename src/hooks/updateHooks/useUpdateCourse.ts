import { useUpdateDocument } from './useUpdateDocument';

interface UpdateCourseParams {
    name?: string;
    description?: string;
    isPublic?: boolean;
}

export const useUpdateCourse = (courseId: string) => {
    const updateDocument = useUpdateDocument<UpdateCourseParams>();

    const updateCourse = ({ name, description, isPublic }: UpdateCourseParams) => {
        const updateData: UpdateCourseParams = {};
        
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (typeof isPublic === 'boolean') updateData.isPublic = isPublic;
        
        if (Object.keys(updateData).length > 0) {
            updateDocument.mutate({
                collection: 'courses',
                documentId: courseId,
                updateData,
            });
        }
    };

    return updateCourse;
};