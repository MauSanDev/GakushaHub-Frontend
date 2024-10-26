import React, { useEffect, useState } from 'react';
import LocSpan from '../../components/LocSpan.tsx';
import InstitutionBox from './Components/InstitutionBox.tsx';
import CreateInstitutionModal from './CreateInstitutionModal';
import MembershipBox from './Components/MembershipBox';
import { usePaginatedInstitutions } from '../../hooks/institutionHooks/usePaginatedInstitutions';
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import { useAuth } from '../../context/AuthContext';
import { InstitutionData } from "../../data/Institutions/InstitutionData.ts";
import DottedBox from '../../components/DottedBox';
import {MembershipRole} from "../../data/MembershipData.ts";

const InstitutionListPage: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const { memberships, refetchMemberships, licenseType } = useAuth();
    const [isMembershipsLoading, setIsMembershipsLoading] = useState<boolean>(true);
    const [institutions, setInstitutions] = useState<InstitutionData[]>([]);
    const { data: institutionsData, isLoading: institutionsLoading, fetchInstitutions } = usePaginatedInstitutions(1, 1);

    useEffect(() => {
        if (institutionsData?.documents) {
            setInstitutions(institutionsData.documents);
        }
    }, [institutionsData]);

    const ownerInstitution = institutions.length > 0 ? institutions[0] : null;

    useEffect(() => {
        const fetchInstitutionsData = async () => {
            try {
                await fetchInstitutions();
            } catch (error) {
                console.error('Error fetching institutions:', error);
            }
        };

        fetchInstitutionsData();
    }, []);


    useEffect(() => {
        let isMounted = true;

        const fetchMembershipsData = async () => {
            try {
                setIsMembershipsLoading(true);
                await refetchMemberships();
            } catch (error) {
                console.error('Error fetching memberships:', error);
            } finally {
                if (isMounted) {
                    setIsMembershipsLoading(false);
                }
            }
        };

        fetchMembershipsData();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleCreateInstitutionSuccess = () => {
        setIsCreateModalOpen(false);
        fetchInstitutions();
    };

    return (
        <SectionContainer title={"私の学校"} isLoading={institutionsLoading || isMembershipsLoading}>
            <div className="w-full max-w-4xl flex flex-col gap-6 text-left pb-24">

                {licenseType === 'sensei' && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                            <LocSpan textKey={"institution.myInstitution"} />
                        </h2>
                        {ownerInstitution ? (
                            <InstitutionBox
                                institutionId={ownerInstitution._id}
                                institutionName={ownerInstitution.name}
                                institutionDescription={ownerInstitution.description}
                                userRole={MembershipRole.Owner}
                            />
                        ) : (
                            <DottedBox
                                title="You don't have your Institution yet."
                                description="Click here to Create"
                                onClick={() => setIsCreateModalOpen(true)}
                            />
                        )}
                    </div>)}

                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        <LocSpan textKey={"institution.myMemberships"} />
                    </h2>
                    {memberships?.length ? (
                        memberships.map((membership) => (
                            <MembershipBox key={membership?._id || ""} membership={membership}/>
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