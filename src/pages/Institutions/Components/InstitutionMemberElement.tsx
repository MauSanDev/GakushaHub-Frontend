import React, { useEffect, useState } from 'react';
import { FaTrash, FaUndo } from 'react-icons/fa';
import { MembershipRole, MembershipData, MembershipStatus } from "../../../data/MembershipData.ts";
import { useChangeMembershipStatus } from "../../../hooks/institutionHooks/useChangeMembershipStatus";
import { useUpdateData } from "../../../hooks/updateHooks/useUpdateData.ts";
import {useUserInfo} from "../../../hooks/newHooks/Courses/useUserInfo.ts";

interface InstitutionMemberElementProps {
    member: MembershipData;
    onRemove: (toRemove: string) => void;
    onRoleChange: (newRole: string) => void;
    canEditRole: boolean;
    enableRemove?: boolean;
    userRole: MembershipRole;
}

const InstitutionMemberElement: React.FC<InstitutionMemberElementProps> = ({
                                                                               member, onRemove, onRoleChange, canEditRole, enableRemove = false, userRole
                                                                           }) => {
    const roleColors: { [key: string]: string } = {
        owner: 'dark:description-purple-500 description-purple-400',
        staff: 'dark:description-yellow-500 description-yellow-500',
        sensei: 'dark:description-blue-400 description-blue-400',
        student: 'dark:description-green-500 description-green-400',
    };

    const [selectedRole, setSelectedRole] = useState<MembershipRole>(member.role || MembershipRole.Student);
    const { mutate: changeMembershipStatus } = useChangeMembershipStatus();
    const { mutate: updateMemberRole } = useUpdateData<Partial<MembershipData>>();
    const { fetchUserInfo, data: userInfo } = useUserInfo([member?.userId]);

    useEffect(() => {
        if (member.userId) {
            fetchUserInfo();
        }
    }, [member.userId]);

    useEffect(() => {
        if (member.role) {
            setSelectedRole(member.role);
        }
    }, [member.role]);

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = event.target.value as MembershipRole;
        setSelectedRole(newRole);
        onRoleChange(newRole);

        updateMemberRole({
            collection: 'membership',
            documentId: member._id,
            newData: { role: newRole }
        });
    };

    const handleSendAgain = () => {
        changeMembershipStatus({ membershipId: member._id, newStatus: MembershipStatus.Pending });
    };

    const isRegisteredUser = !!member.userId && userInfo;

    const handleRemoveClick = () => {
        const confirmDelete = window.confirm("Are you sure you want to remove this member?");
        if (confirmDelete) {
            onRemove(member._id);
        }
    };

    return (
        <div className="flex items-center p-4 border-b border-gray-300 dark:border-gray-600 hover:dark:bg-gray-800 hover:bg-blue-100 transition-all">
            <img
                src={isRegisteredUser ? 'https://via.placeholder.com/40' : 'https://via.placeholder.com/40?text=?'}
                alt={isRegisteredUser ? userInfo?.[member.userId]?.name || member.email : member.email}
                className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex-1">
                <p className="text-md font-bold text-gray-800 dark:text-gray-200">
                    {isRegisteredUser ? userInfo?.[member.userId]?.name || member.email : member.email}
                </p>
                {isRegisteredUser && (<p className="text-sm text-gray-500">
                    {member.email}
                </p>)}
                {member.status === MembershipStatus.Pending && (
                    <span className="italic text-yellow-700 text-xs">Pending approval</span>
                )}
            </div>

            <div className="flex items-center">
                {member.status === MembershipStatus.Rejected && (
                    <div className="flex items-center mr-4">
                        <span className="italic text-red-400">Rejected</span>
                        <button
                            onClick={handleSendAgain}
                            className="text-blue-500 hover:text-blue-700 ml-2 flex items-center"
                            title="Send Again"
                        >
                            <FaUndo size={16} />
                            <span className="ml-2">Send Again</span>
                        </button>
                    </div>
                )}

                {member.status === MembershipStatus.Approved && (member.role !== 'owner' || userRole === 'owner') && 
                        canEditRole ? (
                            <select
                                value={selectedRole}
                                onChange={handleRoleChange}
                                className={`uppercase font-bold cursor-pointer focus:outline-none bg-transparent mr-4 ${roleColors[selectedRole]}`}
                            >
                                {userRole === 'owner' && <option value="owner">Master</option>}
                                <option value="staff">Staff</option>
                                <option value="sensei">Sensei</option>
                                <option value="student">Student</option>
                            </select>
                        ) : (
                            <span className={`uppercase font-bold mr-4 ${roleColors[selectedRole]}`}>
                                {selectedRole}
                            </span>
                        
                )}

                {enableRemove && canEditRole && (member.role !== 'owner' || userRole === 'owner') &&
                    <button
                        onClick={handleRemoveClick}
                        className="text-red-500 hover:text-red-700"
                        title="Remove Member"
                    >
                        <FaTrash size={16} />
                    </button>
                }
            </div>
        </div>
    );
};

export default InstitutionMemberElement;