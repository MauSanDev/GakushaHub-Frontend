import React, { useEffect, useMemo } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { MembershipData, MembershipStatus } from '../../data/MembershipData';
import SelectableContainer from "../../components/ui/containers/SelectableContainer";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import { useUserInfo } from "../../hooks/newHooks/Courses/useUserInfo";
import { useCachedImage } from "../../hooks/newHooks/Resources/useCachedImage";

const DEFAULT_USER_IMAGE = 'https://via.placeholder.com/40';

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
        path: `users/${member.userId}/profileImage`,
        defaultImage: DEFAULT_USER_IMAGE,
    });

    useEffect(() => {
        if (member.userId) fetchUserInfo();
    }, [member.userId]);

    const toggleSelection = () => {
        isSelected ? onDeselectMember(member) : onSelectMember(member);
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
                    src={userImage || DEFAULT_USER_IMAGE}
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

            {isPending && (
                <div className="flex gap-2 mt-2 sm:mt-0 justify-end">
                    <span className="italic text-yellow-500 mr-4">Pending approval</span>
                    <PrimaryButton
                        onClick={() => onSelectMember(member)}
                        label="Accept"
                        className="text-xs w-32 bg-green-500 hover:bg-green-600 dark:bg-green-500 hover:dark:bg-green-600"
                        iconComponent={<FaCheck />}
                    />
                    <PrimaryButton
                        onClick={() => onDeselectMember(member)}
                        label="Reject"
                        className="text-xs w-32 bg-red-500 hover:bg-red-600 dark:bg-red-600 hover:dark:bg-red-600"
                        iconComponent={<FaTimes />}
                    />
                </div>
            )}

            {isRejected && (
                <span className="italic text-red-400 mt-4 text-right">Rejected</span>
            )}
        </SelectableContainer>
    );
};

export default SelectableMemberBox;