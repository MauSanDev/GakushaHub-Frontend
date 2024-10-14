import { useFullPagination } from '../newHooks/useFullPagination.ts';
import { StudyGroupData } from '../../data/Institutions/StudyGroupData.ts';
import { useAuth } from "../../context/AuthContext.tsx";

export const useMyStudyGroups = (
    page: number,
    limit: number,
    keyword?: string
) => {
    const { memberships } = useAuth();

    // Variables iniciales
    let searches: Record<string, string[]> = {};
    const extraParams: Record<string, string> = {};

    // Configurar searches solo si memberships no es nulo y tiene datos
    if (memberships && memberships.length > 0) {
        if (keyword) {
            searches['search1'] = [keyword];
            searches['search1fields'] = ['name', 'description'];
        }

        const institutionIds = memberships.map(m => m.institutionId);
        const membershipIds = memberships.map(m => m._id);

        searches['search2'] = institutionIds;
        searches['search2fields'] = ['institutionId'];

        searches['search3'] = membershipIds;
        searches['search3fields'] = ['memberIds'];
    }

    // Llamar al hook useFullPagination siempre, pero con valores predeterminados si no hay memberships
    const { mutate, isLoading, data, resetQueries } = useFullPagination<StudyGroupData>(
        page,
        limit,
        'studyGroup',
        memberships && memberships.length > 0 ? searches : {},  // Pasar searches o un objeto vacío
        extraParams
    );

    if (!memberships || memberships.length === 0) {
        return {
            data: null,
            isLoading: false,
            resetQueries: () => {},
            fetchStudyGroups: () => {},  // Función vacía para evitar ejecución
        };
    }

    return {
        data,
        isLoading,
        resetQueries,
        fetchStudyGroups: mutate,
    };
};