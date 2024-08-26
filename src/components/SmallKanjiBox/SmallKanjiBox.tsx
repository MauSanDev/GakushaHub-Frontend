import React, { useState } from 'react';
import { KanjiData } from '../../data/data-structures';

interface SmallKanjiBoxProps {
    result: KanjiData | null;
}

const SmallKanjiBox: React.FC<SmallKanjiBoxProps> = ({ result }) => {
    const [showAllReadings, setShowAllReadings] = useState(false);

    if (!result) return null;

    const toggleReadings = () => setShowAllReadings(!showAllReadings);

    const onyomiToShow = showAllReadings ? result.readings.onyomi : result.readings.onyomi.slice(0, 3);
    const kunyomiToShow = showAllReadings ? result.readings.kunyomi : result.readings.kunyomi.slice(0, 3);

    return (
        <div
            className="bg-white p-2 rounded-md shadow-sm text-center border border-gray-200 hover:border-blue-300 w-full cursor-pointer"
            onMouseEnter={toggleReadings}
            onMouseLeave={toggleReadings}
            onClick={toggleReadings}
        >
            <h1 className="text-2xl font-bold text-blue-400">{result.kanji}</h1>
            <p className="text-xs text-gray-600">
                音: {onyomiToShow.join("; ")}
            </p>
            <p className="text-xs text-gray-600">
                訓: {kunyomiToShow.join("; ")}
            </p>
            <p className="text-xs text-gray-600">{result.meanings[0]}</p>
        </div>
    );
};

export default SmallKanjiBox;