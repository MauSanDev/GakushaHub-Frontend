import React from 'react';
import { FaCrown } from 'react-icons/fa';
import LocSpan from '../../LocSpan.tsx';

interface CreatorLabelProps {
    name?: string;
    isAnonymous?: boolean;
    createdAt?: string;
}

const CreatorLabel: React.FC<CreatorLabelProps> = ({ name, isAnonymous, createdAt }) => {
    const displayName = isAnonymous || !name ? "Anonymous" : name;

    return (
        <p className="inline-flex text-xs text-gray-500 mb-2 gap-2">
            <FaCrown />
            <LocSpan textKey={"createdBy"} replacements={[displayName]} /> {createdAt && ("- " + new Date(createdAt).toLocaleDateString())}
        </p>
    );
};

export default CreatorLabel;