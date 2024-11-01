import { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { fetchFullPagination } from '../../services/dataService.ts';
import { MembershipData } from '../../data/MembershipData';
import {PaginatedData} from "../../data/PaginatedData.ts";
import {CollectionTypes} from "../../data/CollectionTypes.tsx";

export const usePaginatedMembers = (
    page: number,
    limit: number,
    institutionId: string,
    keyword?: string
) => {
    const queryClient = useQueryClient();
    const [data, setData] = useState<PaginatedData<MembershipData> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const extraParams = { institutionId };
    const searches: Record<string, string[]> = {};

    if (keyword) {
        searches['search1'] = [keyword];
        searches['search1fields'] = ['email'];
    }

    const fetchMemberships = async () => {
        setIsLoading(true);
        try {
            const result = await fetchFullPagination<MembershipData>(
                page,
                limit,
                CollectionTypes.Membership,
                queryClient,
                searches,
                extraParams,
                {},
                '',
                [],
                false,
                { joinedAt: -1}
            );
            setData(result || null);
        } catch (error) {
            console.error('Error fetching memberships:', error);
            setData(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMemberships();
    }, [page, limit, institutionId, keyword]);

    return {
        data,
        isLoading,
        resetQueries: () => queryClient.invalidateQueries('membership'),
        fetchMemberships,
    };
};