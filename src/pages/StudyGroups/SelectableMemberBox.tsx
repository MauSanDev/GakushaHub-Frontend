import React, { useEffect, useMemo } from 'react';
import { MembershipData, MembershipStatus } from '../../data/MembershipData';
import SelectableContainer from "../../components/ui/containers/SelectableContainer";
import { useUserInfo } from "../../hooks/newHooks/Courses/useUserInfo";
import { useCachedImage } from "../../hooks/newHooks/Resources/useCachedImage";
import manabuMoriProfile from '../../assets/bg-dark-mode.jpg'

interface SelectableMemberBoxProps {
    member: MembershipData;
    isSelected: boolean;
    onSelectMember: (member: MembershipData) => void;
    onDeselectMember: (member: MembershipData) => void;
}

const roleColors: { [key: string]: string } = {
    owner: 'text-purple-500 dark:text-purple-500',
    staff: 'text-yellow-500 dark:text-yellow-500',
    sensei: 'text-blue-400 dark:text-blue-400',
    student: 'text-green-500 dark:text-green-400',
};

const SelectableMemberBox: React.FC<SelectableMemberBoxProps> = ({ member, isSelected, onSelectMember, onDeselectMember }) => {
    const { fetchUserInfo, data: userInfo } = useUserInfo([member.userId]);
    const { imageUrl: userImage } = useCachedImage({
        path: `users/${member.userId}/profileImage`,});

    useEffect(() => {
        if (member.userId) fetchUserInfo();
    }, [member.userId]);

    const toggleSelection = () => {
        if (isSelected) {
            onDeselectMember(member)
        } else {
            onSelectMember(member);
        }
    };

    // Memoize computed values to avoid re-computation on each render
    const displayName = useMemo(() => {
        return userInfo?.[member.userId]?.name || member.email;
    }, [userInfo, member.email, member.userId]);

    const nickname = useMemo(() => {
        return userInfo?.[member.userId]?.nickname || '';
    }, [userInfo, member.userId]);

    const isPending = member.status === MembershipStatus.Pending;
    const isRejected = member.status === MembershipStatus.Rejected;

    return (
        <SelectableContainer isSelected={isSelected} onClick={toggleSelection} className="w-full max-w-4xl my-2">
            <div className="flex items-center gap-4">
                <img
                    src={userImage || manabuMoriProfile}
                    alt={displayName}
                    className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex-1">
                    <h3 className="text-md font-bold text-gray-800 dark:text-white">
                        {displayName}
                        {nickname && <span className="text-sm text-gray-400 dark:text-gray-500"> ({nickname})</span>}
                    </h3>
                    {userInfo && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                    )}
                </div>

                <span className={`uppercase font-bold ml-4 ${roleColors[member.role]}`}>
                    {member.role}
                </span>
            </div>

            <div className="flex gap-2 mt-2 sm:mt-0 justify-end">
                {isPending && (
                        <span className="italic text-yellow-500 mr-4">Pending approval</span>
                )}
                {isRejected && (
                    <span className="italic text-red-400 mt-4 text-right">Rejected</span>
                )}
            </div>

        </SelectableContainer>
    );
};

export default SelectableMemberBox;