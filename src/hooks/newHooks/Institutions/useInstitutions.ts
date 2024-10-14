import { useState, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { fetchElements } from '../../../services/dataService';
import { InstitutionData } from '../../../data/Institutions/InstitutionData';

export const useInstitution = (
    ids: string[]
): {
    data: Record<string, InstitutionData> | undefined,
    isLoading: boolean,
    fetchInstitution: () => void 
} => {
    const queryClient = useQueryClient();
    const [data, setData] = useState<Record<string, InstitutionData> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchInstitution = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await fetchElements<InstitutionData>(ids, 'institution', queryClient);
            setData(result);
        } catch (error) {
            console.error('Error fetching institution:', error);
            setData(undefined);
        } finally {
            setIsLoading(false);
        }
    }, [ids, queryClient]);

    return {
        data,
        isLoading,
        fetchInstitution,
    };
};