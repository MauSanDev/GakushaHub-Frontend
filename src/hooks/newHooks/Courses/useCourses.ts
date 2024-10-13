import { useElements } from '../useElements';
import { CourseData } from '../../../data/CourseData';

export const useCourses = (
    ids: string[]
): ReturnType<typeof useElements<CourseData>> => {
    return useElements<CourseData>(ids, 'course');
};