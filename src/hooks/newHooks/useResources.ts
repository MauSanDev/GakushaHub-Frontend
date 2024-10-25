import { useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import {createElement, fetchFullPagination} from "../../services/dataService.ts";
import {ResourceData} from "../../data/Institutions/ResourceData.ts";
import {CollectionTypes} from "../../data/CollectionTypes.tsx";
import {PaginatedData} from "../../data/PaginatedData.ts";
import {useAuth} from "../../context/AuthContext.tsx";

interface CreateResourcePayload {
    title: string;
    description?: string;
    type: string;
    url?: string;
    tags?: string[];
    institutionId: string;
}

export const useResources = (
    institutionId: string,
    page: number,
    limit: number,
    type?: string,
): {
    fetchResources: () => Promise<void>,
    createResource: (payload: CreateResourcePayload) => Promise<ResourceData>,
    isLoading: boolean,
    isCreating: boolean,
    data?: PaginatedData<ResourceData>,
    resetQueries: () => void
} => {
    const { userData } = useAuth();
    const queryClient = useQueryClient();
    const [data, setData] = useState<PaginatedData<ResourceData> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const searches: Record<string, string[]> = {};

    if (type) {
        searches['search1'] = [type];
        searches['search1fields'] = ['type'];
    }

    searches['search2'] = [institutionId];
    searches['search2fields'] = ['institutionId'];

    const fetchResources = async () => {
        setIsLoading(true);
        try {
            const result = await fetchFullPagination<ResourceData>(
                page,
                limit,
                CollectionTypes.Resources,
                queryClient,
                searches,
                {},
                {},
            );
            setData(result);
        } catch (error) {
            console.error('Error fetching resources:', error);
            setData(undefined);
        } finally {
            setIsLoading(false);
        }
    };

    const createResource = useMutation<ResourceData, unknown, CreateResourcePayload>(
        async (payload: CreateResourcePayload) => {
            if (!payload.title || payload.title.trim() === '') {
                throw new Error("Resource title is required");
            }

            if (!userData || !userData._id) {
                throw new Error("User data not available");
            }

            const data: Record<string, unknown> = {
                title: payload.title,
                description: payload.description || '',
                type: payload.type,
                url: payload.url,
                tags: payload.tags || [],
                institutionId: payload.institutionId,
                creatorId: userData._id,
            };

            return await createElement(CollectionTypes.Resources, data, queryClient) as ResourceData;
        },
        {
            onError: (error) => {
                console.error("Error creating resource:", error);
            },
            onSuccess: () => {
                queryClient.invalidateQueries('resources');
            }
        }
    );

    const resetQueries = () => {
        queryClient.invalidateQueries('resources');
    };

    return {
        data,
        isLoading,
        fetchResources,
        createResource: createResource.mutateAsync,
        isCreating: createResource.isLoading,
        resetQueries,
    };
};