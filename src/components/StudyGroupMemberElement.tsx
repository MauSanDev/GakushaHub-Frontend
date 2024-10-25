import React, { useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { MembershipData, MembershipRole, MembershipStatus } from "../data/MembershipData.ts";
import { useUpdateList } from "../hooks/updateHooks/useUpdateList.ts";
import { CollectionTypes } from "../data/CollectionTypes.tsx";
import TertiaryButton from "./ui/buttons/TertiaryButton.tsx";
import { useUserInfo } from "../hooks/newHooks/Courses/useUserInfo.ts";

interface StudyGroupMemberElementProps {
    member: MembershipData;
    studyGroupId: string;
    viewerRole: MembershipRole;
}

const StudyGroupMemberElement: React.FC<StudyGroupMemberElementProps> = ({ member, studyGroupId, viewerRole }) => {
    const roleColors: { [key: string]: string } = {
        owner: 'dark:description-purple-500 description-purple-400',
        staff: 'dark:description-yellow-500 description-yellow-500',
        sensei: 'dark:description-blue-400 description-blue-400',
        student: 'dark:description-green-500 description-green-400',
    };

    const { mutate: modifyList } = useUpdateList(); // Usa el nuevo hook
    const { fetchUserInfo, data: userInfo } = useUserInfo([member?.userId]);

    useEffect(() => {
        fetchUserInfo();
    }, [member]);

    const handleRemoveClick = () => {
        const confirmDelete = window.confirm("Are you sure you want to remove this member from the group?");
        if (confirmDelete) {
            modifyList({
                collection: CollectionTypes.StudyGroup,
                documentId: studyGroupId,
                field: 'memberIds',
                value: [member._id],
                action: 'remove'
            });
        }
    };

    const isRegisteredUser = !!member.userId;

    return (
        <div key={studyGroupId} className="flex items-center p-4 border-b border-gray-300 dark:border-gray-600 hover:dark:bg-gray-800 hover:bg-blue-100 transition-all">
            <img
                src={isRegisteredUser ? 'https://via.placeholder.com/40' : 'https://via.placeholder.com/40?text=?'}
                alt={isRegisteredUser ? member.userId : member.email}
                className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex-1">
                <p className="text-md font-bold text-gray-800 dark:text-gray-200">
                    {isRegisteredUser ? userInfo?.[member.userId]?.name || member.email : member.email}
                </p>
                <p className="text-sm text-gray-500">
                    {member.email}
                </p>
                {member.status === MembershipStatus.Pending && (
                    <span className="italic text-yellow-700 text-xs">Pending approval</span>
                )}
            </div>

            <div className="flex items-center">
                <span className={`uppercase font-bold mr-4 ${roleColors[member.role]}`}>
                    {member.role}
                </span>

                {(viewerRole === MembershipRole.Sensei || viewerRole === MembershipRole.Owner) &&
                    <TertiaryButton onClick={handleRemoveClick} iconComponent={<FaTrash />} label={"Remove"} />
                }
            </div>
        </div>
    );
};

export default StudyGroupMemberElement;