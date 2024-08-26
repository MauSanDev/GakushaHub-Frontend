import React from 'react';
import { WordData } from '../../data/data-structures';
import { useLanguage } from '../../context/LanguageContext';

interface SmallWordBoxProps {
    result: WordData;
}

const SmallWordBox: React.FC<SmallWordBoxProps> = ({ result }) => {
    const { language } = useLanguage();

    if (!result) return null;

    const meaningToShow = result.meanings.map(meaning =>
        (meaning[language] ? meaning[language] : meaning['en'])
    );

    return (
        <div
            className="bg-white p-2 rounded-md shadow-sm text-center border border-gray-200 hover:border-blue-300 w-full relative group">
            <h1 className="text-lg font-bold text-blue-400 truncate">{result.word}</h1>
            <div className="flex justify-center gap-2 text-sm text-gray-600">
                <span>{result.readings[0]}</span>
            </div>
            <p className="text-xs text-gray-600">{meaningToShow.slice(0,3).join("; ")}</p>
        </div>
    );
};

export default SmallWordBox;