import React from 'react';
import { WordData } from "../data/WordData.ts";
import { useLanguage } from "../context/LanguageContext.tsx";
import { FaCheck } from 'react-icons/fa';
import SelectableContainer from "./ui/containers/SelectableContainer.tsx";

interface WordDataElementProps {
    result: WordData;
    isSelected: boolean;
    onSelect: (isSelected: boolean) => void;
}

const WordDataElement: React.FC<WordDataElementProps> = ({ result, isSelected, onSelect }) => {
    const { language } = useLanguage();

    if (!result) return null;

    const meaningToShow = result.meanings.map(meaning =>
        (meaning[language] ? meaning[language] : meaning['en'])
    );

    return (
        <SelectableContainer onClick={() => onSelect(!isSelected)} isSelected={isSelected}>
            <span className="absolute top-2 right-2 bg-blue-400 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                言葉
            </span>
            <div
                className={`absolute top-2 right-12 w-6 h-6 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 ${
                    isSelected ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-700'
                }`}
            >
                {isSelected && <FaCheck />}
            </div>
            <h1 className="text-4xl font-bold mb-4 text-blue-400 dark:text-gray-300 text-center">{result.word}</h1>
            <h3 className="text-2xl mb-2 text-gray-600 dark:text-gray-200 text-center">
                {result.readings.slice(0, 3).join('; ')}
            </h3>
            <h2 className="text-xl text-gray-600 dark:text-gray-300 capitalize mb-4">
                {meaningToShow.slice(0, 3).join("; ")}
            </h2>
            <div className="flex justify-center gap-2 flex-wrap">
                {result.part_of_speech.map((pos: string, index: number) => (
                    <span key={index} className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-1 text-xs">
                        {pos}
                    </span>
                ))}
            </div>
        </SelectableContainer>
    );
};

export default WordDataElement;