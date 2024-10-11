import React, { useEffect, useState } from 'react';
import LocSpan from '../../components/LocSpan.tsx';
import InstitutionBox from './Components/InstitutionBox.tsx';
import CreateInstitutionModal from './CreateInstitutionModal';
import MembershipBox from './Components/MembershipBox';
import { usePaginatedInstitutions } from '../../hooks/institutionHooks/usePaginatedInstitutions';
import { useMyMemberships } from '../../hooks/institutionHooks/useMyMemberships';
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";

const InstitutionListPage: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    
    const { data: institutionsData, error: institutionsError, isLoading: institutionsLoading, fetchInstitutions } = usePaginatedInstitutions(1, 1);
    const { data: membershipsData, error: membershipsError, isLoading: membershipsLoading, fetchMemberships } = useMyMemberships(1, 10);

    const ownerInstitution = institutionsData?.documents[0] || null;

    useEffect(() => {
        fetchInstitutions(); 
        fetchMemberships();  
    }, [fetchInstitutions, fetchMemberships]);

    const handleCreateInstitutionSuccess = () => {
        setIsCreateModalOpen(false);
    };

    return (
        <SectionContainer title={"私の学校"} isLoading={institutionsLoading || membershipsLoading}>
            <div className="w-full max-w-4xl flex flex-col gap-6 text-left pb-24">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        <LocSpan textKey={"institutionListPage.myInstitution"} />
                    </h2>
                    {institutionsError ? (
                        <p className="text-red-500 text-center">Error fetching institutions</p>
                    ) : ownerInstitution ? (
                        <InstitutionBox
                            institutionId={ownerInstitution._id}
                            institutionName={ownerInstitution.name}
                            institutionDescription={ownerInstitution.description}
                            members={ownerInstitution.members || 0}
                            groups={ownerInstitution.groups || 0}
                            resources={ownerInstitution.resources || 0}
                            userRole="owner"
                        />
                    ) : (
                        <div
                            className="p-6 my-10 border-2 border-dashed border-gray-400 dark:border-gray-600 hover:dark:border-green-800 hover:border-green-700 rounded-lg shadow-md text-center cursor-pointer transition-all hover:bg-green-100 dark:hover:bg-green-950 flex items-center justify-center h-48 text-gray-600 dark:text-gray-400 hover:dark:text-green-400 hover:text-green-700 "
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <p className="mb-4 text-xl">
                                You don't have your Institution yet.<br/>
                                <span>Click here to Create</span>
                            </p>
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        <LocSpan textKey={"institutionListPage.myMemberships"} />
                    </h2>
                    {membershipsError ? (
                        <p className="text-red-500 text-center">Error fetching memberships</p>
                    ) : membershipsData?.documents?.length || 0 > 0 ? (
                        membershipsData?.documents.map((membership) => (
                            <MembershipBox key={membership._id} membership={membership} />
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No memberships found</p>
                    )}
                </div>
            </div>

            {isCreateModalOpen && (
                <CreateInstitutionModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreateSuccess={handleCreateInstitutionSuccess}
                />
            )}
        </SectionContainer>
    );
};

export default InstitutionListPage;