import React from 'react';
import { WordData } from "../data/WordData.ts";
import { useLanguage } from "../context/LanguageContext.tsx";
import SelectableContainer from "./ui/containers/SelectableContainer.tsx";
import RoundedTag from "./ui/text/RoundedTag.tsx";

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
            <RoundedTag textKey={"言葉"} className={"absolute top-2 left-2 "}/>
            
            <h1 className="text-4xl font-bold mb-4 text-blue-400 dark:text-gray-300 text-center">{result.word}</h1>
            <h3 className="text-2xl mb-2 text-gray-600 dark:text-gray-200 text-center">
                {result.readings.slice(0, 3).join('; ')}
            </h3>
            <h2 className="text-xl text-gray-600 dark:text-gray-300 capitalize mb-4">
                {meaningToShow.slice(0, 3).join("; ")}
            </h2>
            <div className="flex justify-center gap-2 flex-wrap">
                {result.part_of_speech.map((pos: string, index: number) => (
                    <RoundedTag key={index} textKey={pos} />
                ))}
            </div>
        </SelectableContainer>
    );
};

export default WordDataElement;