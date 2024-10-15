import { useFakePagination } from '../useFakePagination';
import {CollectionTypes} from "../../../data/CollectionTypes.tsx";
import {CourseData} from "../../../data/CourseData.ts";

export const useFollowedCourses = (
    memberIds: string[],
    page: number,
    limit: number
) => {

    const { mutate, isLoading, data, resetQueries } = useFakePagination<CourseData>(
        memberIds,
        page,
        limit,
        CollectionTypes.Course,
    );

    return {
        data,
        isLoading,
        resetQueries,
        fetchCourses: mutate,
    };
};