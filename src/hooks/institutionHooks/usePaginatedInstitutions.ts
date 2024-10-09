import { useQuery } from 'react-query';
import { InstitutionData } from '../../data/Institutions/InstitutionData.ts';
import { ApiClient } from '../../services/ApiClient';
import { useAuth } from "../../context/AuthContext.tsx";

export const usePaginatedInstitutions = (page: number, limit: number) => {
    const { userData } = useAuth();

    const fetchPaginatedInstitutions = async () => {
        return await ApiClient.get<InstitutionData[]>(`/api/institution/paginated?page=${page}&limit=${limit}`);
    };

    const { data, error, isLoading, refetch } = useQuery<InstitutionData[]>(
        ['institutions', page, limit, userData?._id],
        fetchPaginatedInstitutions,
        {
            enabled: !!userData?._id, // Solo hace el fetch si userData está definido
            keepPreviousData: true, // Mantiene los datos previos mientras se está cargando la nueva página
            staleTime: 5 * 60 * 1000, // 5 minutos de caché antes de considerar los datos "stale"
            cacheTime: 10 * 60 * 1000, // 10 minutos antes de eliminar la caché
        }
    );

    return { data, error, isLoading, refetch };
};