import { useElements } from '../useElements';
import { InstitutionData } from '../../../data/Institutions/InstitutionData';

export const useCourses = (
    ids: string[]
): ReturnType<typeof useElements<InstitutionData>> => {
    return useElements<InstitutionData>(ids, 'institution');
};