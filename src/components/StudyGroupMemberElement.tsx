import React, { useEffect } from 'react';
import {FaChalkboardTeacher, FaTrash} from 'react-icons/fa';
import { MembershipData, MembershipRole, MembershipStatus } from "../data/MembershipData.ts";
import { useUpdateList } from "../hooks/updateHooks/useUpdateList.ts";
import { CollectionTypes } from "../data/CollectionTypes.tsx";
import TertiaryButton from "./ui/buttons/TertiaryButton.tsx";
import { useUserInfo } from "../hooks/newHooks/Courses/useUserInfo.ts";
import { useCachedImage } from "../hooks/newHooks/Resources/useCachedImage.ts";
import LocSpan from "./LocSpan.tsx";

interface StudyGroupMemberElementProps {
    member: MembershipData;
    studyGroupId: string;
    viewerRole: MembershipRole;
}

const StudyGroupMemberElement: React.FC<StudyGroupMemberElementProps> = ({ member, studyGroupId, viewerRole }) => {

    const { mutate: modifyList } = useUpdateList();
    const { fetchUserInfo, data: userInfo } = useUserInfo([member?.userId]);

    const { imageUrl: userImage } = useCachedImage({
        path: `users/${member.userId}/profileImage`});

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
    
    const canEdit = (viewerRole === MembershipRole.Sensei || viewerRole === MembershipRole.Owner || viewerRole === MembershipRole.Staff); 

    return (
        <div key={studyGroupId} className="flex items-center p-4 border-b border-gray-300 dark:border-gray-600 hover:dark:bg-gray-800 hover:bg-blue-100 transition-all">
            <img
                src={userImage}
                alt={isRegisteredUser ? userInfo?.[member.userId]?.name || member.email : member.email}
                className="w-10 h-10 rounded-full object-cover mr-4"
            />
            <div className="flex-1">
                {isRegisteredUser ? (
                    <p className="text-md font-bold text-gray-800 dark:text-gray-200">
                        {userInfo?.[member.userId]?.name || userInfo?.[member.userId]?.email} {userInfo?.[member.userId]?.nickname && <span className="text-sm text-gray-400 dark:text-gray-500"> ({userInfo?.[member.userId]?.nickname})</span>}
                    </p>
                ) : (
                    <p className="text-md font-bold text-gray-800 dark:text-gray-200">
                        {member.email}
                    </p>
                )}
                {canEdit && <p className="text-sm text-gray-500">
                    {member.email}
                </p>}
                {member.status === MembershipStatus.Pending && (
                    <span className="italic text-yellow-700 text-xs">Pending approval</span>
                )}
            </div>

            <div className="flex items-center gap-2">

                {(member.role === MembershipRole.Owner || member.role === MembershipRole.Staff || member.role === MembershipRole.Sensei) &&
                    <div className="flex items-center gap-2 text-2xl text-blue-500 dark:text-gray-300">
                        <FaChalkboardTeacher/>
                        <LocSpan textKey={'professor'} className="text-sm" />
                    </div>
                }
                {canEdit &&
                    <TertiaryButton onClick={handleRemoveClick} iconComponent={<FaTrash/>} label={"remove"}/>
                }
            </div>
        </div>
    );
};

export default StudyGroupMemberElement;