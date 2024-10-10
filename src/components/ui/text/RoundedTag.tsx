import React from 'react';
import LocSpan from '../../LocSpan.tsx';

interface RoundedTagProps {
    textKey: string;
    namespace?: string;
}

const RoundedTag: React.FC<RoundedTagProps> = ({ textKey, namespace }) => {
    return (
        <span className="absolute top-2 right-12 bg-blue-400 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
            <LocSpan textKey={textKey} namespace={namespace} />
        </span>
    );
};

export default RoundedTag;