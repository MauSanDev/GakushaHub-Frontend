import React, { useEffect, useState } from 'react';
import { FaTrash, FaUndo } from 'react-icons/fa';
import { MembershipRole, MembershipData, MembershipStatus } from "../../../data/Institutions/MembershipData.ts";
import { useChangeMembershipStatus } from "../../../hooks/institutionHooks/useChangeMembershipStatus";

interface InstitutionMemberElementProps {
    member: MembershipData;
    onRemove: () => void;
    onRoleChange: (newRole: string) => void;
}

const InstitutionMemberElement: React.FC<InstitutionMemberElementProps> = ({
                                                                               member,
                                                                               onRemove,
                                                                               onRoleChange
                                                                           }) => {
    const roleColors: { [key: string]: string } = {
        owner: 'dark:text-purple-500 text-purple-400',
        staff: 'dark:text-yellow-500 text-yellow-500',
        sensei: 'dark:text-blue-400 text-blue-400',
        student: 'dark:text-green-500 text-green-400',
    };

    const [selectedRole, setSelectedRole] = useState<MembershipRole>(member.role || MembershipRole.Student);
    const { mutate: changeMembershipStatus } = useChangeMembershipStatus(); // Hook to change membership status

    useEffect(() => {
        if (member.role) {
            setSelectedRole(member.role);
        }
    }, [member.role]);

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = event.target.value as MembershipRole; // Type assertion to MembershipRole
        setSelectedRole(newRole);
        onRoleChange(newRole);
    };

    const handleSendAgain = () => {
        changeMembershipStatus({ membershipId: member._id, newStatus: MembershipStatus.Pending });
    };

    const isRegisteredUser = !!member.userId; // Check if the user is registered

    return (
        <div className="flex items-center p-4 border-b border-gray-300 dark:border-gray-600 hover:dark:bg-gray-800 hover:bg-blue-100 transition-all">
            <img
                src={isRegisteredUser ? 'https://via.placeholder.com/40' : 'https://via.placeholder.com/40?text=?'}
                alt={isRegisteredUser ? member.userId?.name : member.email}
                className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex-1">
                {isRegisteredUser ? (
                    <p className="text-md font-bold text-gray-800 dark:text-gray-200">
                        {member.userId?.name} <span className="pl-4 text-sm text-gray-500 font-normal">{member.email}</span>
                    </p>
                ) : (
                    <p className="text-md font-bold text-gray-800 dark:text-gray-200">{member.email}</p>
                )}
            </div>

            {member.status === MembershipStatus.Pending && (
                <span className="italic text-gray-400 mr-4">Pending approval</span>
            )}

            {member.status === MembershipStatus.Rejected && (
                <div className="flex items-center">
                    <span className="italic text-red-400 mr-4">Rejected</span>
                    <button
                        onClick={handleSendAgain}
                        className="text-blue-500 hover:text-blue-700 ml-4 flex items-center"
                        title="Send Again"
                    >
                        <FaUndo size={16} />
                        <span className="ml-2">Send Again</span>
                    </button>
                </div>
            )}

            {member.status === MembershipStatus.Approved && (
                <select
                    value={selectedRole}
                    onChange={handleRoleChange}
                    className={`uppercase font-bold cursor-pointer mr-4 focus:outline-none bg-transparent ${roleColors[selectedRole]}`}
                >
                    <option value="owner">Master</option>
                    <option value="staff">Staff</option>
                    <option value="sensei">Sensei</option>
                    <option value="student">Student</option>
                </select>
            )}

            <button
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 ml-4"
                title="Remove Member"
            >
                <FaTrash size={16} />
            </button>
        </div>
    );
};

export default InstitutionMemberElement;