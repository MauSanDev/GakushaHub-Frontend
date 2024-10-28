import React from 'react';
import LocSpan from '../../LocSpan.tsx';

interface RoundedTagProps {
    textKey: string;
    namespace?: string;
    className?: string;
}

const RoundedTag: React.FC<RoundedTagProps> = ({ textKey, namespace, className }) => {
    return (
        <span className={`bg-blue-400 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-full ${className}`}>
            <LocSpan textKey={textKey} namespace={namespace} />
        </span>
    );
};

export default RoundedTag;