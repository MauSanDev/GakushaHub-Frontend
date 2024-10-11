import { usePaginatedData } from '../usePaginatedData.ts';
import { MembershipData } from '../../data/Institutions/MembershipData.ts';
import { useAuth } from '../../context/AuthContext.tsx';

export const usePaginatedMembers = (
    page: number,
    limit: number,
    institutionId: string,
    searchQuery?: string
) => {
    const { userData } = useAuth();

    if (!userData || !userData._id) {
        throw new Error('Pagination data not available');
    }

    const extraParams: Record<string, string> = {};

    if (institutionId) {
        extraParams['institutionId'] = institutionId;
    }

    if (searchQuery) {
        extraParams['searchQuery'] = searchQuery;  // Agregamos la búsqueda si está presente
    }

    const mutation = usePaginatedData<MembershipData>(
        '/api/institution/members/list',
        page,
        limit,
        userData._id,
        extraParams
    );

    return {
        ...mutation,
        fetchMembers: mutation.mutate,
    };
};