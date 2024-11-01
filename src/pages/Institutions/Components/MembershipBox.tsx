import React, { useEffect, useState } from 'react';
import { MembershipData, MembershipStatus, MembershipRole } from '../../../data/MembershipData.ts';
import { useChangeMembershipStatus } from '../../../hooks/institutionHooks/useChangeMembershipStatus';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import Container from "../../../components/ui/containers/Container.tsx";
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton.tsx";
import { useNavigate } from "react-router-dom";
import { useInstitution } from '../../../hooks/newHooks/Institutions/useInstitutions.ts';
import { useCachedImage } from '../../../hooks/newHooks/Resources/useCachedImage.ts';

interface MembershipBoxProps {
    membership: MembershipData;
}

const roleColors: { [key: string]: string } = {
    owner: 'text-purple-400 dark:text-purple-500',
    staff: 'text-yellow-500 dark:text-yellow-500',
    sensei: 'text-blue-400 dark:text-blue-400',
    student: 'text-green-500 dark:text-green-400',
};

const MembershipBox: React.FC<MembershipBoxProps> = ({ membership }) => {
    const { mutate: changeStatus, isLoading: isChangingStatus } = useChangeMembershipStatus();
    const navigate = useNavigate();

    const { data: institutionData, fetchInstitution, isLoading } = useInstitution([membership.institutionId]);
    const institutionName = institutionData?.[membership.institutionId]?.name || 'Unknown Institution';
    const institutionDescription = institutionData?.[membership.institutionId]?.description || 'No description available';

    const { imageUrl: institutionImage } = useCachedImage({
        path: `institutions/${membership.institutionId}/profileImage`});

    const [currentStatus, setCurrentStatus] = useState(membership.status);

    useEffect(() => {
        fetchInstitution();
    }, [membership]);

    const handleAccept = () => {
        changeStatus(
            { membershipId: membership._id, newStatus: 'approved' },
            { onSuccess: () => setCurrentStatus(MembershipStatus.Approved) }
        );
    };

    const handleReject = () => {
        changeStatus(
            { membershipId: membership._id, newStatus: 'rejected' },
            { onSuccess: () => setCurrentStatus(MembershipStatus.Rejected) }
        );
    };

    if (isLoading) {
        return <div>Loading institution details...</div>;
    }

    return (
        <Container className="w-full max-w-4xl my-2">
            <div className="flex items-center gap-4">
                <img
                    src={institutionImage}
                    alt="Institution"
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg object-cover"
                />

                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        {institutionName}
                        <span className={`ml-2 uppercase ${roleColors[membership.role]}`}>
                            {membership.role}
                        </span>
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {institutionDescription}
                    </p>
                </div>
            </div>

            {currentStatus === MembershipStatus.Pending && (
                <div className="flex gap-2 mt-2 sm:mt-0 justify-end">
                    <p className="text-sm text-yellow-500 mt-2">
                        You received this membership.
                    </p>

                    {isChangingStatus ? (
                        <div className="text-yellow-500 flex items-center">
                            <FaSpinner className="animate-spin mr-2" />
                            Processing...
                        </div>
                    ) : (
                        <>
                            <PrimaryButton
                                onClick={handleAccept}
                                label="accept"
                                className="text-xs w-40 bg-green-500 hover:bg-green-600 dark:bg-green-500 hover:dark:bg-green-600"
                                iconComponent={<FaCheck />}
                            />
                            <PrimaryButton
                                onClick={handleReject}
                                label="reject"
                                className="text-xs w-40 bg-red-500 hover:bg-red-600 dark:bg-red-600 hover:dark:bg-red-600"
                                iconComponent={<FaTimes />}
                            />
                        </>
                    )}
                </div>
            )}

            {currentStatus === MembershipStatus.Rejected && (
                <div className="mt-4 text-red-500 text-sm font-semibold">
                    Rejected
                </div>
            )}

            <div className="mt-4 flex justify-end gap-4">
                <PrimaryButton
                    className="w-40"
                    label="institution.seeProfile"
                    onClick={() => {
                        navigate(`/institution/${membership.institutionId}`);
                    }}
                />
                {(membership.role === MembershipRole.Owner || membership.role === MembershipRole.Sensei || membership.role === MembershipRole.Staff) && (
                    <PrimaryButton
                        className="w-40"
                        label="institution.editSchool"
                        onClick={() => {
                            navigate(`/institution/${membership.institutionId}/studyGroups`);
                        }}
                    />
                )}
            </div>
        </Container>
    );
};

export default MembershipBox;