import React from 'react';
import { KanjiData } from "../../data/KanjiData.ts";
import { useLanguage } from '../../context/LanguageContext';
import { FaCheck } from 'react-icons/fa';

interface KanjiBoxProps {
    result: KanjiData | null;
    isSelected: boolean;
    onSelect: (isSelected: boolean) => void;
}

const KanjiBox: React.FC<KanjiBoxProps> = ({ result, isSelected, onSelect }) => {
    const { language } = useLanguage();

    if (!result) return null;

    const truncatedText = (text: string, maxLength: number) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    const meanings = result.meanings.map(meaning =>
        meaning[language] ? meaning[language] : meaning['en']
    );

    return (
        <div
            className={`relative p-6 rounded-2xl shadow-lg text-center transform transition-transform duration-300 lg:hover:scale-105 border-2 ${
                isSelected ? 'border-green-500 dark:border-green-700 hover:dark:border-green-500 ' : 'border-gray-200 dark:border-gray-800 hover:dark:border-gray-700 '
            } bg-white dark:bg-gray-900 hover:border-blue-300 group`}
            onClick={() => onSelect(!isSelected)}
        >
            <span className="absolute top-2 right-2 bg-blue-400 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                漢字
            </span>
            <div
                className={`absolute top-2 right-12 w-6 h-6 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 ${
                    isSelected ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-700'
                }`}
            >
                {isSelected && <FaCheck />}
            </div>
            <h1 className="text-6xl font-bold mb-4 text-blue-400 dark:text-white">{result.kanji}</h1>
            <div className="text-gray-400 text-sm mb-2 flex flex-col gap-2 items-center">
                {result.readings.kunyomi.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center items-center">
                        <span className="text-xs text-gray-500 mr-1">訓:</span>
                        {result.readings.kunyomi.map((reading, index) => (
                            <span key={index} className="bg-gray-200 dark:bg-gray-800 text-gray-500 rounded-1xl px-1 py-0.5">
                                {truncatedText(reading, 10)}
                            </span>
                        ))}
                    </div>
                )}
                {result.readings.onyomi.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center items-center">
                        <span className="text-xs text-gray-500 mr-1">音:</span>
                        {result.readings.onyomi.map((reading, index) => (
                            <span key={index} className="bg-gray-200 dark:bg-gray-800 text-gray-500 rounded-1xl px-1 py-0.5">
                                {truncatedText(reading, 10)}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <h2 className="text-l text-gray-600 dark:text-gray-300 capitalize">
                {truncatedText(meanings.join('; '), 30)}
            </h2>
        </div>
    );
};

export default KanjiBox;