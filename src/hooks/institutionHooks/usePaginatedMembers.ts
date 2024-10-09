import { usePaginatedData } from '../usePaginatedData.ts';
import { MembershipData } from '../../data/Institutions/MembershipData.ts';
import { useAuth } from '../../context/AuthContext.tsx';

export const usePaginatedMembers = (page: number, limit: number, institutionId: string) => {
    const { userData } = useAuth();

    if (!userData || !userData._id) {
        throw new Error('Pagination data not available');
    }

    const { data, error, resetQueries, ...rest } = usePaginatedData<MembershipData>(
        '/api/institution/members/list',
        page,
        limit,
        userData._id,
        institutionId ? { institutionId } : undefined
    );

    return { data, error, resetQueries, ...rest };
};