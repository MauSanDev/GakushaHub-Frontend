import { useFakePagination } from '../useFakePagination'; 
import { MembershipData } from '../../../data/MembershipData.ts'; 

export const useStudyMembers = (
    memberIds: string[],  
    page: number,         
    limit: number         
) => {

    // console.log('members', memberIds);
    
    const { mutate, isLoading, data, resetQueries } = useFakePagination<MembershipData>(
        memberIds,
        page,
        limit,
        'membership',
    );

    return {
        data,
        isLoading,
        resetQueries,
        fetchStudyMembers: mutate,  
    };
};