import React from 'react';
import { WordData } from "../../data/WordData.ts";
import {useLanguage} from "../../context/LanguageContext.tsx";


interface WordBoxProps {
    result: WordData;
}

const WordBox: React.FC<WordBoxProps> = ({ result }) => {
    const { language } = useLanguage();

    if (!result) return null;

    const meaningToShow = result.meanings.map(meaning =>
        (meaning[language] ? meaning[language] : meaning['en'])
    );
    
    return (
        <div className="relative bg-white dark:bg-black p-6 rounded-2xl shadow-lg text-center transform transition-transform duration-300 hover:scale-105 border-2 border-gray-200 hover:border-blue-300">
            <span className="absolute top-2 right-2 bg-blue-400 text-white text-xs px-2 py-1 rounded-full">
                言葉
            </span>
            <h1 className="text-4xl font-bold mb-4 text-blue-400">{result.word}</h1>
            <h3 className="text-2xl mb-2 text-gray-600 dark:text-gray-300 dark:text-gray-200">
                {result.readings.slice(0, 3).join('; ')}
            </h3>
            <h2 className="text-xl text-gray-600 dark:text-gray-300 capitalize mb-4">
                {meaningToShow.slice(0, 3).join("; ")}
            </h2>
            <div className="flex justify-center gap-2 flex-wrap">
                {result.part_of_speech.map((pos: string, index: number) => (
                    <span key={index} className="bg-gray-200 text-gray-600 dark:text-gray-300 rounded-full px-2 py-1 text-xs">
                        {pos}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default WordBox;