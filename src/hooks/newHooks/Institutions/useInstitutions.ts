import { useElements } from '../useElements';
import { InstitutionData } from '../../../data/Institutions/InstitutionData';

export const useInstitution = (
    ids: string[]
): ReturnType<typeof useElements<InstitutionData>> => {
    return useElements<InstitutionData>(ids, 'institution');
};