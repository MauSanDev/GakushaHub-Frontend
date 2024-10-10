import React from 'react';
import LocSpan from '../../LocSpan.tsx';

interface HighlightableTagProps {
    labelKey: string;
    valueKey: string;
    namespace?: string;
}

const HighlightableTag: React.FC<HighlightableTagProps> = ({ labelKey, valueKey, namespace }) => {
    return (
        <span className="bg-gray-200 dark:bg-gray-950 text-gray-500 rounded-1xl px-1 py-0.5 transition-all duration-300 hover:bg-gray-300 hover:dark:bg-gray-800 hover:text-gray-600 dark:text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">
            <LocSpan textKey={labelKey} />:&nbsp;
            <LocSpan textKey={valueKey} namespace={namespace} />
        </span>
    );
};

export default HighlightableTag;