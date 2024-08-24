import React from 'react';
import { KanjiData } from '../../data/data-structures';

interface KanjiBoxProps {
    result: KanjiData | null;
}

const KanjiBox: React.FC<KanjiBoxProps> = ({ result }) => {
    if (!result) return null;

    const truncatedText = (text: string, maxLength: number) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    return (
        <div className="relative bg-white p-6 rounded-2xl shadow-lg text-center transform transition-transform duration-300 hover:scale-105 border-2 border-gray-200 hover:border-blue-300 group">
            <span className="absolute top-2 right-2 bg-blue-400 text-white text-xs px-2 py-1 rounded-full">
                漢字
            </span>
            <h1 className="text-6xl font-bold mb-4 text-blue-400">{result.kanji}</h1>
            <div className="text-gray-400 text-sm mb-2 flex flex-col gap-2">
                {result.readings.onyomi.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-gray-500 mr-1">音:</span>
                        {result.readings.onyomi.map((reading, index) => (
                            <span
                                key={index}
                                className="bg-gray-200 text-gray-500 rounded-1xl px-1 py-0.5 transition-all duration-300 group-hover:bg-gray-300 group-hover:text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap"
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
                {result.readings.kunyomi.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-gray-500 mr-1">訓:</span>
                        {result.readings.kunyomi.map((reading, index) => (
                            <span
                                key={index}
                                className="bg-gray-200 text-gray-500 rounded-1xl px-1 py-0.5 transition-all duration-300 group-hover:bg-gray-300 group-hover:text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap"
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
            <h2 className="text-xl text-gray-600 capitalize">
                <span className="group-hover:hidden">
                    {truncatedText(result.meanings.join('; '), 30)}
                </span>
                <span className="hidden group-hover:inline">
                    {result.meanings.join('; ')}
                </span>
            </h2>
        </div>
    );
};

export default KanjiBox;