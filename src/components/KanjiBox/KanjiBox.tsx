import React from 'react';
import { KanjiData } from '../../data/data-structures.tsx';

interface KanjiBoxProps {
    result: KanjiData | null;
}

const KanjiBox: React.FC<KanjiBoxProps> = ({ result }) => {
    if (!result) return null;

    return (
        <div className="bg-white p-4 rounded shadow text-center">
            <h1 className="text-4xl font-bold mb-2">{result.kanji}</h1>
            <h3 className="text-2xl mb-2">
                {result.readings.onyomi.join(', ')} - {result.readings.kunyomi.join(', ')}
            </h3>
            <h2 className="text-xl">
                {result.related.length > 0 && result.related[0].meaning}
            </h2>
        </div>
    );
};

export default KanjiBox;