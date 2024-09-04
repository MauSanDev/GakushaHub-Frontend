import React from 'react';
import { KanjiData } from "../../data/KanjiData.ts";
import { useLanguage } from '../../context/LanguageContext';

interface KanjiBoxProps {
    result: KanjiData | null;
}

const KanjiBox: React.FC<KanjiBoxProps> = ({ result }) => {
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
            className="relative p-6 rounded-2xl shadow-lg text-center transform transition-transform duration-300 lg:hover:scale-105 border-2  bg-white dark:bg-gray-900 hover:border-blue-300 hover:dark:border-gray-700 border-gray-200 dark:border-gray-800 group">
            <span className="absolute top-2 right-2 bg-blue-400 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                漢字
            </span>
            <h1 className="text-6xl font-bold mb-4 text-blue-400 dark:text-white">{result.kanji}</h1>
            <div className="text-gray-400 text-sm mb-2 flex flex-col gap-2 items-center">
                {result.readings.kunyomi.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center items-center">
                        <span className="text-xs text-gray-500 mr-1">訓:</span>
                        {result.readings.kunyomi.map((reading, index) => (
                            <span
                                key={index}
                                className="bg-gray-200 dark:bg-gray-800 text-gray-500 rounded-1xl px-1 py-0.5 transition-all duration-300 group-hover:bg-gray-300 group-hover:dark:bg-gray-700 group-hover:text-gray-600 group-hover:dark:text-gray-100 dark:text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap"
                            >
                    <span className="group-hover:hidden">
                        {truncatedText(reading, 10)}
                    </span>
                    <span className="hidden group-hover:inline">
                        {reading}
                    </span>
                </span>
                        ))}
                    </div>
                )}
                {result.readings.onyomi.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center items-center">
                        <span className="text-xs text-gray-500 mr-1">音:</span>
                        {result.readings.onyomi.map((reading, index) => (
                            <span
                                key={index}
                                className="bg-gray-200 dark:bg-gray-800 text-gray-500 rounded-1xl px-1 py-0.5 transition-all duration-300 group-hover:bg-gray-300 group-hover:dark:bg-gray-700 group-hover:text-gray-600 group-hover:dark:text-gray-100 dark:text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap"
                            >
                    <span className="group-hover:hidden">
                        {truncatedText(reading, 10)}
                    </span>
                    <span className="hidden group-hover:inline">
                        {reading}
                    </span>
                </span>
                        ))}
                    </div>
                )}
            </div>
            <h2 className="text-l text-gray-600 dark:text-gray-300 capitalize">
                <span className="group-hover:hidden">
                    {truncatedText(meanings.join('; '), 30)}
                </span>
                <span className="hidden group-hover:inline text-s">
                    {meanings.join('; ')}
                </span>
            </h2>
        </div>
    );
};

export default KanjiBox;