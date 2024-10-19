import React from 'react';
import { WordData } from '../../data/WordData.ts';
import { useLanguage } from '../../context/LanguageContext';
import {FaCheck} from "react-icons/fa";

interface SmallWordBoxProps {
    result: WordData;
    isSelected: boolean;
    onClick: () => void;
}

const SmallWordBox: React.FC<SmallWordBoxProps> = ({ result, isSelected = true, onClick }) => {
    const { language } = useLanguage();

    if (!result) return null;

    const meaningToShow = result.meanings.map(meaning =>
        (meaning[language] ? meaning[language] : meaning['en'])
    );

    return (
        <div
            className={`relative p-2 rounded-md shadow-sm text-center border  bg-white dark:bg-gray-950 hover:border-blue-300 hover:dark:border-gray-700 border-gray-200 dark:border-gray-800 w-full cursor-pointer
            ${
                isSelected ? 'dark:border-green-800 dark:hover:border-green-600 border-green-500 hover:border-green-300' : ''
            }`}
            onClick={onClick}>

            <div
                className={`absolute top-2 right-2 w-6 h-6 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 ${
                    isSelected ? 'text-green-500' : ''
                }`}
            >
                {isSelected && <FaCheck/>}
            </div>
            
            <h1 className="text-lg font-bold text-blue-400 dark:text-white truncate">{result.word}</h1>
            <div className="flex justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span>{result.readings[0]}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">{meaningToShow.slice(0, 3).join("; ")}</p>
        </div>
    );
};

export default SmallWordBox;