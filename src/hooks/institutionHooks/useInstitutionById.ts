import { useQuery } from 'react-query';
import { InstitutionData } from '../../data/Institutions/InstitutionData.ts';
import { ApiClient } from '../../services/ApiClient';

export const useInstitutionById = (institutionId: string) => {
    const fetchInstitution = async () => {
        return await ApiClient.get<InstitutionData>(`/api/institution/${institutionId}`);
    };

    const { data, error, isLoading, refetch } = useQuery<InstitutionData>(
        ['institution', institutionId],
        fetchInstitution,
        {
            enabled: !!institutionId, // Solo hace el fetch si institutionId está definido
            staleTime: 5 * 60 * 1000, // 5 minutos de caché antes de que React Query considere los datos "stale"
            cacheTime: 10 * 60 * 1000, // 10 minutos antes de que la caché se elimine
        }
    );

    return { data, error, isLoading, refetch };
};