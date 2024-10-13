import { useElements } from '../useElements';
import { LessonData } from '../../../data/CourseData';

export const useLessons = (
    ids: string[]
): ReturnType<typeof useElements<LessonData>> => {
    return useElements<LessonData>(ids, 'course/lesson');
};