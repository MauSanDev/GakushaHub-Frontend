import React, { useState } from 'react';
import { KanjiData } from '../../data/KanjiData.ts';
import { useLanguage } from '../../context/LanguageContext';

interface SmallKanjiBoxProps {
    result: KanjiData | null;
}

const SmallKanjiBox: React.FC<SmallKanjiBoxProps> = ({ result }) => {
    const [showAllReadings, setShowAllReadings] = useState(false);
    const { language } = useLanguage();

    if (!result) return null;

    const toggleReadings = () => setShowAllReadings(!showAllReadings);

    const onyomiToShow = showAllReadings ? result.readings.onyomi : result.readings.onyomi.slice(0, 3);
    const kunyomiToShow = showAllReadings ? result.readings.kunyomi : result.readings.kunyomi.slice(0, 3);

    const meaningToShow = result.meanings.map(meaning =>
        meaning[language] ? meaning[language] : meaning['en']
    );
    
    return (
        <div
            className="bg-white dark:bg-black p-2 rounded-md shadow-sm text-center border border-gray-200 hover:border-blue-300 w-full cursor-pointer"
            onMouseEnter={toggleReadings}
            onMouseLeave={toggleReadings}
            onClick={toggleReadings}
        >
            <h1 className="text-2xl font-bold text-blue-400">{result.kanji}</h1>
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