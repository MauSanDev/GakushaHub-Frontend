import React from 'react';
import { WordData } from '../../data/data-structures';

interface SmallWordBoxProps {
    result: WordData;
}

const SmallWordBox: React.FC<SmallWordBoxProps> = ({ result }) => {
    if (!result) return null;

    return (
        <div
            className="bg-white p-2 rounded-md shadow-sm text-center border border-gray-200 hover:border-blue-300 w-full relative group">
            <h1 className="text-lg font-bold text-blue-400 truncate">{result.word}</h1>
            <div className="flex justify-center gap-2 text-sm text-gray-600">
                <span>{result.readings[0]}</span>
            </div>
            <p className="text-xs text-gray-600">{result.meanings[0]}</p>
        </div>
    );
};

export default SmallWordBox;