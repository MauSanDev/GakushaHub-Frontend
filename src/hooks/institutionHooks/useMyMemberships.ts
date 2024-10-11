import { usePaginatedData } from '../usePaginatedData.ts';
import { MembershipData } from '../../data/Institutions/MembershipData.ts';
import { useAuth } from "../../context/AuthContext.tsx";

export const useMyMemberships = (page: number, limit: number) => {
    const { userData } = useAuth();

    const mutation = usePaginatedData<MembershipData>(
        '/api/institution/myMemberships',
        page,
        limit,
        userData?._id
    );

    return {
        ...mutation,
        fetchMemberships: mutation.mutate,
    };
};