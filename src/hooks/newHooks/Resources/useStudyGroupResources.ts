import { useFakePagination } from '../useFakePagination';
import { BaseDeckData } from '../../../data/DeckData.ts';
import {CollectionTypes} from "../../../data/CollectionTypes.tsx";

export const useStudyGroupResources = (
    resourceGroupIds: string[],
    page: number,
    limit: number
) => {

    // console.log('groups', resourceGroupIds)
    
    const { mutate, isLoading, data, resetQueries } = useFakePagination<BaseDeckData>(
        resourceGroupIds,
        page,
        limit,
        CollectionTypes.ResourcesGroup
    );

    return {
        data,
        isLoading,
        resetQueries,
        fetchStudyGroupResources: mutate,
    };
};