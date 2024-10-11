import { usePaginatedData } from '../usePaginatedData.ts';
import { InstitutionData } from '../../data/Institutions/InstitutionData.ts';
import { useAuth } from "../../context/AuthContext.tsx";

export const usePaginatedInstitutions = (
    page: number,
    limit: number,
    keyword?: string
) => {
    const { userData } = useAuth();
    
    const extraParams: Record<string, string> = {};

    if (keyword) {
        extraParams['keyword'] = keyword;
    }

    const mutation = usePaginatedData<InstitutionData>(
        '/api/institution/paginated', 
        page,                         
        limit,                        
        userData?._id,                
        extraParams                   
    );

    return {
        ...mutation,
        fetchInstitutions: mutation.mutate,  
    };
};