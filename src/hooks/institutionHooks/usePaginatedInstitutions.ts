import { useFullPagination } from "../newHooks/useFullPagination.ts";
import { InstitutionData } from '../../data/Institutions/InstitutionData.ts';
import { useAuth } from "../../context/AuthContext.tsx";

export const usePaginatedInstitutions = (
    page: number,
    limit: number,
    keyword?: string
) => {
    const { userData } = useAuth();

    const searches: Record<string, string[]> = {};
    const extraParams: Record<string, string> = {};

    // Si existe un keyword, se agrega a la búsqueda
    if (keyword) {
        searches['search1'] = [keyword];  // Valor a buscar
        searches['search1fields'] = ['name', 'description'];  // Campos donde buscar
    }

    // Si existe userData, pasamos el userId (creatorId) como extraParam
    if (userData?._id) {
        extraParams['creatorId'] = userData._id;
    }

    const { mutate, isLoading, data, resetQueries } = useFullPagination<InstitutionData>(
        page,
        limit,
        'institution',
        searches,   // Usamos el objeto searches para las búsquedas por keyword
        extraParams // Pasamos creatorId en extraParams
    );

    return {
        data,
        isLoading,
        resetQueries,
        fetchInstitutions: mutate,  // Renombramos mutate como fetchInstitutions
    };
};