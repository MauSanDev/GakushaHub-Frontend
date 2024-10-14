import { useFullPagination } from '../newHooks/useFullPagination';
import { MembershipData } from '../../data/MembershipData.ts';

export const usePaginatedMembers = (
    page: number,
    limit: number,
    institutionId: string,
    keyword?: string
) => {
    const extraParams = { institutionId };
    const searches: Record<string, string[]> = {};

    if (keyword) {
        searches['search1'] = [keyword];
        searches['search1fields'] = ['structure', 'keywords'];
    }

    const { mutate, isLoading, data, resetQueries } = useFullPagination<MembershipData>(
        page,
        limit,
        'membership',
        searches,
        extraParams
    );

    return {
        mutate,
        isLoading,
        data,
        resetQueries,
        fetchMemberships: mutate,
    };
};