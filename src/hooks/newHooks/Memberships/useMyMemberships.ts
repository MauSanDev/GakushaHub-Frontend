import { useFullPagination } from '../useFullPagination';
import { MembershipData } from '../../../data/MembershipData.ts';

export const useMyMemberships = (userId: string) => {
    const extraParams = {
        userId: userId 
    };

    const { mutate, isLoading, data, resetQueries } = useFullPagination<MembershipData>(
        1,      
        99,     
        'membership',
        {},     
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