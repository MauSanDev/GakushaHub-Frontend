import { useState, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { fetchElements } from '../../services/dataService';
import { InstitutionData } from '../../data/Institutions/InstitutionData.ts';

export const useInstitutionById = (institutionId: string): {
    data: InstitutionData | undefined,
    isLoading: boolean,
    fetchInstitution: () => void
} => {
    const queryClient = useQueryClient();
    const [data, setData] = useState<InstitutionData | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchInstitution = useCallback(async () => {
        if (!institutionId) return;

        setIsLoading(true);
        try {
            
            const result = await fetchElements<InstitutionData>([institutionId], 'institution', queryClient);

            
            setData(result[institutionId]);
        } catch (error) {
            console.error('Error fetching institution:', error);
            setData(undefined);
        } finally {
            setIsLoading(false);
        }
    }, [institutionId, queryClient]);

    return {
        data,
        isLoading,
        fetchInstitution, 
    };
};