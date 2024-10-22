import { useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { fetchFullPagination, createElement } from '../../../services/dataService.ts';
import { ScheduleEventData } from '../../../data/ScheduleEventData';
import { PaginatedData } from '../../../data/PaginatedData';
import { useAuth } from "../../../context/AuthContext";
import { CollectionTypes } from "../../../data/CollectionTypes";

interface CreateSchedulePayload {
    name: string;
    desc?: string;
    timestamp: string;
    studyGroupId: string;
    institutionId: string;
    creatorId: string;
}

export const useSchedule = (
    studyGroupId: string,
    institutionId: string,
    timestamp: string,
    page: number,
    limit: number
): {
    fetchSchedule: () => Promise<void>,
    createScheduleEvent: (payload: CreateSchedulePayload) => Promise<ScheduleEventData>,
    isLoading: boolean,
    isCreating: boolean,
    data?: PaginatedData<ScheduleEventData>,
    resetQueries: () => void
} => {
    const { userData } = useAuth();
    const queryClient = useQueryClient();
    const [data, setData] = useState<PaginatedData<ScheduleEventData> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const searches: Record<string, string[]> = {};

    if (studyGroupId) {
        searches['search1'] = [studyGroupId, institutionId];
        searches['search1fields'] = ['studyGroupId', 'institutionId'];
    }
    
    if (timestamp) {
        searches['search2'] = [timestamp];
        searches['search2fields'] = ['timestamp'];
    }

    const fetchSchedule = async () => {
        setIsLoading(true);
        try {
            const result = await fetchFullPagination<ScheduleEventData>(
                page,
                limit,
                'schedule',
                queryClient,
                searches,
                {},
                {},
            );
            setData(result);
        } catch (error) {
            console.error('Error fetching schedule:', error);
            setData(undefined);
        } finally {
            setIsLoading(false);
        }
    };

    // Crear nuevo evento en la agenda
    const createScheduleEvent = useMutation<ScheduleEventData, unknown, CreateSchedulePayload>(
        async (payload: CreateSchedulePayload) => {
            if (!payload.name || payload.name.trim() === '') {
                throw new Error("Event name is required");
            }

            if (!userData || !userData._id) {
                throw new Error("User data not available");
            }

            const data: Record<string, unknown> = {
                name: payload.name,
                desc: payload.desc || '',
                timestamp: payload.timestamp,
                studyGroupId: payload.studyGroupId,
                institutionId: payload.institutionId,
                creatorId: userData._id
            };

            return await createElement(CollectionTypes.Schedule, data, queryClient) as ScheduleEventData;
        },
        {
            onError: (error) => {
                console.error("Error creating schedule event:", error);
            },
            onSuccess: () => {
                queryClient.invalidateQueries('schedule');
            }
        }
    );

    const resetQueries = () => {
        queryClient.invalidateQueries('schedule');
    };

    return {
        data,
        isLoading,
        fetchSchedule,
        createScheduleEvent: createScheduleEvent.mutateAsync,
        isCreating: createScheduleEvent.isLoading,
        resetQueries,
    };
};