import { useFullPagination } from '../useFullPagination.ts';
import { InstitutionData } from '../../../data/Institutions/InstitutionData.ts';
import { useAuth } from "../../../context/AuthContext.tsx";

export const useMyInstitutions = (
    page: number,
    limit: number
) => {
    const { userData } = useAuth();

    const extraParams: Record<string, string> = {};

    if (userData?._id) {
        extraParams['creatorId'] = userData._id;
    }

    const { mutate, isLoading, data, resetQueries } = useFullPagination<InstitutionData>(
        page,
        limit,
        'institution',
        {},
        extraParams
    );

    return {
        data,
        isLoading,
        resetQueries,
        fetchInstitutions: mutate,
    };
};