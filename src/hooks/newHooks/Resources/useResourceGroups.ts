import { useState } from 'react';
import { useQueryClient } from 'react-query';
import {createElement, fetchFullPagination} from '../../../services/dataService.ts';
import { BaseDeckData } from '../../../data/DeckData.ts';
import { PaginatedData } from '../../../data/PaginatedData';
import { CollectionTypes } from '../../../data/CollectionTypes';
import { useAuth } from '../../../context/AuthContext.tsx';

interface CreateResourceGroupPayload {
    name: string;
    description: string;
    institutionId: string;
    elements: string[];
    isPublic: boolean;
}

export const useResourceGroups = (
    page: number,
    limit: number,
    search: string = '',
    fields: string[] = [],
    institutionId: string, 
): {
    data: PaginatedData<BaseDeckData> | undefined,
    isLoading: boolean,
    fetchResourceGroups: () => Promise<void>,
    createResourceGroup: (payload: CreateResourceGroupPayload) => Promise<BaseDeckData | undefined>,
    resetQueries: () => void
} => {
    const queryClient = useQueryClient();
    const { userData } = useAuth();
    const [data, setData] = useState<PaginatedData<BaseDeckData> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const searches: Record<string, string[]> = {};

    if (search) {
        searches['search1'] = [search];
        searches['search1fields'] = ['name'];
    }

    const fetchResourceGroups = async () => {
        setIsLoading(true);
        try {
            const result = await fetchFullPagination<BaseDeckData>(
                page,
                limit,
                CollectionTypes.ResourcesGroup,
                queryClient,
                searches,
                {institutionId},
                {},
                userData?._id,
                fields
            );
            setData(result);
        } catch (error) {
            console.error('Error fetching resource groups:', error);
            setData(undefined);
        } finally {
            setIsLoading(false);
        }
    };

    const createResourceGroup = async ({ name, description, elements, isPublic, institutionId }: CreateResourceGroupPayload): Promise<BaseDeckData | undefined> => {
        if (!userData || !userData._id) {
            console.error("User data not available");
            return;
        }

        const resourceGroupData = {
            name,
            description,
            elements,
            creatorId: userData._id,
            institutionId,
            isPublic,
        };

        try {
            const createdResourceGroup = await createElement(CollectionTypes.ResourcesGroup, resourceGroupData, queryClient) as BaseDeckData;
            queryClient.invalidateQueries(CollectionTypes.ResourcesGroup);
            return createdResourceGroup;
        } catch (error) {
            console.error("Error creating resource group:", error);
            return undefined;
        }
    };

    const resetQueries = () => {
        queryClient.invalidateQueries(CollectionTypes.ResourcesGroup);
    };

    return {
        data,
        isLoading,
        fetchResourceGroups,
        createResourceGroup,
        resetQueries,
    };
};