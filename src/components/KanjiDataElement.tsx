import React from 'react';
import { KanjiData } from "../data/KanjiData.ts";
import { useLanguage } from '../context/LanguageContext';
import SelectableContainer from "./ui/containers/SelectableContainer.tsx";
import RoundedTag from "./ui/text/RoundedTag.tsx";
import HighlightableTag from "./ui/text/HighlightableTag.tsx";

interface KanjiDataElementProps {
    result: KanjiData | null;
    isSelected: boolean;
    onSelect: (isSelected: boolean) => void;
}

const KanjiDataElement: React.FC<KanjiDataElementProps> = ({ result, isSelected, onSelect }) => {
    const { language } = useLanguage();

    if (!result) return null;

    const truncatedText = (text: string, maxLength: number) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    const meanings = result.meanings.map(meaning =>
        meaning[language] ? meaning[language] : meaning['en']
    );

    return (
        <SelectableContainer onClick={() => onSelect(!isSelected)} isSelected={isSelected} className={"text-center inherit"}>
            <RoundedTag textKey={"漢字"} className={"absolute top-2 left-2 "}/>
            
            <div className="text-6xl font-bold mb-4 text-blue-400 dark:text-white text-center">{result.kanji}</div>
            <div className="text-gray-400 text-sm mb-2 flex flex-col gap-2 items-center">
                {result.readings.kunyomi.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center items-center">
                        <span className="text-xs text-gray-500 mr-1">訓:</span>
                        {result.readings.kunyomi.map((reading) => (
                            <HighlightableTag labelKey={truncatedText(reading, 10)} />
                        ))}
                    </div>
                )}
                {result.readings.onyomi.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center items-center">
                        <span className="text-xs text-gray-500 mr-1">音:</span>
                        {result.readings.onyomi.map((reading) => (
                            <HighlightableTag labelKey={truncatedText(reading, 10)} />
                        ))}
                    </div>
                )}
            </div>
            <h2 className="text-l text-gray-600 dark:text-gray-300 capitalize">
                {truncatedText(meanings.join('; '), 30)}
            </h2>
        </SelectableContainer>
    );
};

export default KanjiDataElement;