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
            enabled: !!institutionId, 
            staleTime: 5 * 60 * 1000, 
            cacheTime: 10 * 60 * 1000, 
        }
    );

    return { data, error, isLoading, refetch };
};