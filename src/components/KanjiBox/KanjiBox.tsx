import React from 'react';
import { KanjiData } from '../../data/data-structures';

interface KanjiBoxProps {
    result: KanjiData | null;
}

const KanjiBox: React.FC<KanjiBoxProps> = ({ result }) => {
    if (!result) return null;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center transform transition-transform duration-300 hover:scale-105 border-2 border-gray-200 hover:border-blue-300">
            <h1 className="text-6xl font-bold mb-4 text-blue-400">{result.kanji}</h1>
            <h3 className="text-2xl mb-2 text-gray-400">
                {result.readings.onyomi.join(', ')} - {result.readings.kunyomi.join(', ')}
            </h3>
            <h2 className="text-xl text-gray-600 capitalize">
                {result.related.length > 0 && result.related[0].meaning}
            </h2>
        </div>
    );
};

export default KanjiBox;