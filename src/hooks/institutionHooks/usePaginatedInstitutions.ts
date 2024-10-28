import { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { fetchFullPagination } from '../../services/dataService.ts';
import { InstitutionData } from '../../data/Institutions/InstitutionData';
import { useAuth } from "../../context/AuthContext";
import {PaginatedData} from "../../data/PaginatedData.ts";

export const usePaginatedInstitutions = (
    page: number,
    limit: number,
    keyword?: string
) => {
    const { userData } = useAuth();
    const queryClient = useQueryClient();
    
    const [data, setData] = useState<PaginatedData<InstitutionData> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const searches: Record<string, string[]> = {};
    const extraParams: Record<string, string> = {};
    
    if (keyword) {
        searches['search1'] = [keyword];  
        searches['search1fields'] = ['name', 'description'];  
    }
    
    if (userData?._id) {
        extraParams['creatorId'] = userData._id;
    }
    
    const fetchInstitutions = async () => {
        setIsLoading(true);
        try {
            const result = await fetchFullPagination<InstitutionData>(
                page,
                limit,
                'institution',
                queryClient,
                searches,
                extraParams
            );
            setData(result || null);
        } catch (error) {
            console.error('Error fetching institutions:', error);
            setData(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInstitutions();
    }, [page, limit, keyword, userData]);

    return {
        data,
        isLoading,
        resetQueries: () => queryClient.invalidateQueries('institution'),
        fetchInstitutions,
    };
};