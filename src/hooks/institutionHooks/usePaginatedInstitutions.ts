import { usePaginatedData } from '../usePaginatedData.ts'; 
import { InstitutionData } from '../../data/Institutions/InstitutionData.ts';
import { useAuth } from "../../context/AuthContext.tsx";

export const usePaginatedInstitutions = (page: number, limit: number) => {
    const { userData } = useAuth();
    
    const { data, error, isLoading, refetch, resetQueries } = usePaginatedData<InstitutionData>(
        '/api/institution/paginated', 
        page,                         
        limit,                        
        userData?._id                 
    );

    return { data, error, isLoading, refetch, resetQueries };
};