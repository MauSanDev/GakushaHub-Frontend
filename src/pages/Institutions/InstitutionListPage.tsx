import React, { useEffect, useState } from 'react';
import LocSpan from '../../components/LocSpan.tsx';
import InstitutionBox from './Components/InstitutionBox.tsx';
import CreateInstitutionModal from './CreateInstitutionModal';
import MembershipBox from './Components/MembershipBox';
import { usePaginatedInstitutions } from '../../hooks/institutionHooks/usePaginatedInstitutions';
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import { useAuth } from '../../context/AuthContext';

const InstitutionListPage: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const { memberships, refetchMemberships } = useAuth();  // Ahora usamos memberships directamente de useAuth
    const [isMembershipsLoading, setIsMembershipsLoading] = useState<boolean>(true);

    // Cargar instituciones
    const { data: institutionsData, error: institutionsError, isLoading: institutionsLoading, fetchInstitutions } = usePaginatedInstitutions(1, 1);
    const ownerInstitution = institutionsData?.documents[0] || null;

    useEffect(() => {
        // Efecto para cargar instituciones al montar el componente
        const fetchInstitutionsData = async () => {
            try {
                await fetchInstitutions();  // Cargar instituciones
            } catch (error) {
                console.error('Error fetching institutions:', error);
            }
        };

        fetchInstitutionsData();
    }, [fetchInstitutions]);

    useEffect(() => {
        let isMounted = true;  // Para evitar actualizaciones cuando el componente se desmonta

        const fetchMembershipsData = async () => {
            try {
                setIsMembershipsLoading(true);
                await refetchMemberships();  // Refetch con el hook de AuthContext
            } catch (error) {
                console.error('Error fetching memberships:', error);
            } finally {
                if (isMounted) {
                    setIsMembershipsLoading(false);
                }
            }
        };

        fetchMembershipsData();

        console.log(memberships.documents);

        return () => {
            isMounted = false;  // Cleanup
        };
    }, [refetchMemberships]);

    const handleCreateInstitutionSuccess = () => {
        setIsCreateModalOpen(false);
    };

    return (
        <SectionContainer title={"私の学校"} isLoading={institutionsLoading || isMembershipsLoading}>
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
                                You don't have your Institution yet.<br />
                                <span>Click here to Create</span>
                            </p>
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        <LocSpan textKey={"institutionListPage.myMemberships"} />
                    </h2>
                    {memberships?.documents?.length ? (
                        memberships?.documents.map((membership) => (
                            <MembershipBox key={membership?._id || ""} membership={membership} />
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