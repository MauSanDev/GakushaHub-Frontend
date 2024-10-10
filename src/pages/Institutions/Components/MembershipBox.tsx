import React from 'react';
import { MembershipData, MembershipStatus, MembershipRole } from '../../../data/Institutions/MembershipData.ts';
import { useChangeMembershipStatus } from '../../../hooks/institutionHooks/useChangeMembershipStatus';
import { FaCheck, FaTimes } from 'react-icons/fa';

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
    const { mutate: changeStatus } = useChangeMembershipStatus();

    const handleAccept = () => {
        changeStatus({
            membershipId: membership._id,
            newStatus: 'approved',
        });
    };

    const handleReject = () => {
        changeStatus({
            membershipId: membership._id,
            newStatus: 'rejected',
        });
    };

    return (
        <div className="w-full max-w-4xl my-2">
            <div className="relative flex items-center p-4 rounded-lg shadow-md transition-all dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-gray-600">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        {membership.institutionId?.name || 'Unknown Institution'}
                        <span className={`ml-2 ${roleColors[membership.role]}`}>({membership.role})</span>
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {membership.institutionId?.description || 'No description available'}
                    </p>

                    {membership.status === MembershipStatus.Pending && (
                        <p className="text-sm text-yellow-500 mt-2">
                            You received this membership.
                        </p>
                    )}
                </div>

                {/* Botones para aceptar o rechazar si el estado es pending */}
                {membership.status === MembershipStatus.Pending ? (
                    <div className="flex gap-2 mt-2 sm:mt-0">
                        <button
                            onClick={handleAccept}
                            className="flex items-center px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                        >
                            <FaCheck className="mr-2" /> Accept
                        </button>
                        <button
                            onClick={handleReject}
                            className="flex items-center px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                        >
                            <FaTimes className="mr-2" /> Reject
                        </button>
                    </div>
                ) : (
                    <div className="mt-2 sm:mt-0 flex justify-end">
                        <button className="px-12 py-1 bg-blue-500 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-600 hover:dark:bg-blue-600 transition-all">
                            Enter
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MembershipBox;