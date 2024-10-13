import React, {useEffect} from 'react';
import { FaCrown } from 'react-icons/fa';
import LocSpan from '../../LocSpan.tsx';
import {useUserInfo} from "../../../hooks/newHooks/Courses/useUserInfo.ts";

interface CreatorLabelProps {
    creatorId: string;
    isAnonymous?: boolean;
    createdAt?: string;
}

const CreatorLabel: React.FC<CreatorLabelProps> = ({ creatorId, isAnonymous, createdAt }) => {
    const { mutate: fetchUserInfo, data: userInfo } = useUserInfo([creatorId]);
    const displayName = (isAnonymous || !userInfo) ? "Anonymous" : userInfo[creatorId].name;

    useEffect(() => {
        fetchUserInfo([creatorId]);
    }, [creatorId]);

    return (
        <p className="inline-flex text-xs text-gray-500 mb-2 gap-2">
            <FaCrown />
            <LocSpan textKey={"createdBy"} replacements={[displayName]} /> {createdAt && ("- " + new Date(createdAt).toLocaleDateString())}
        </p>
    );
};

export default CreatorLabel;