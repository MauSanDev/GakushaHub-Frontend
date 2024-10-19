import React, { useState } from 'react';
import { KanjiData } from '../../data/KanjiData.ts';
import { useLanguage } from '../../context/LanguageContext';
import {FaCheck} from "react-icons/fa";

interface SmallKanjiBoxProps {
    result: KanjiData | null;
    isSelected: boolean;
    onClick: () => void;
}

const SmallKanjiBox: React.FC<SmallKanjiBoxProps> = ({ result, isSelected = true, onClick }) => {
    const [showAllReadings, setShowAllReadings] = useState(false);
    const { language } = useLanguage();

    if (!result) return null;

    const toggleReadings = () => setShowAllReadings(!showAllReadings);
    const onBoxClick = () =>
    {
        setShowAllReadings(!showAllReadings);
        onClick();
    }

    const onyomiToShow = showAllReadings ? result.readings.onyomi : result.readings.onyomi.slice(0, 3);
    const kunyomiToShow = showAllReadings ? result.readings.kunyomi : result.readings.kunyomi.slice(0, 3);

    const meaningToShow = result.meanings.map(meaning =>
        meaning[language] ? meaning[language] : meaning['en']
    );
    
    return (
        <div
            className={`relative p-2 rounded-md shadow-sm text-center border  bg-white dark:bg-gray-950 hover:border-blue-300 hover:dark:border-gray-700 border-gray-200 dark:border-gray-800 w-full cursor-pointer
            ${
                isSelected ? 'dark:border-green-800 dark:hover:border-green-600 border-green-500 hover:border-green-300' : ''
            }`}
            onMouseEnter={toggleReadings}
            onMouseLeave={toggleReadings}
            onClick={onBoxClick}
        >
            <div
                className={`absolute top-2 right-2 w-6 h-6 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 ${
                    isSelected ? 'text-green-500' : ''
                }`}
            >
                {isSelected && <FaCheck/>}
            </div>
            
            <h1 className="text-2xl font-bold text-blue-400 dark:text-white">{result.kanji}</h1>
            {result.readings.onyomi.length > 0 && (
                <p className="text-xs text-gray-600 dark:text-gray-300">
                    音: {onyomiToShow.join("; ")}
                </p>
            )}

            {result.readings.kunyomi.length > 0 && (

                <p className="text-xs text-gray-600 dark:text-gray-300">
                    訓: {kunyomiToShow.join("; ")}
                </p>
            )}
            <p className="text-xs text-gray-600 dark:text-gray-300">{meaningToShow.slice(0, 3).join("; ")}</p>
        </div>
    );
};

export default SmallKanjiBox;