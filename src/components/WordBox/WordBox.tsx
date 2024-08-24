import React from 'react';
import {WordData} from "../../data/data-structures.tsx";

interface WordBoxProps {
    result: WordData; // Puedes definir una interfaz específica si prefieres
}

const WordBox: React.FC<WordBoxProps> = ({ result }) => {
    if (!result) return null;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center transform transition-transform duration-300 hover:scale-105 border-2 border-gray-200 hover:border-blue-300">
            <h1 className="text-4xl font-bold mb-4 text-blue-400">{result.word}</h1>
            <h3 className="text-2xl mb-2 text-gray-600">
                {result.readings.slice(0, 3).join('; ')}
            </h3>
            <h2 className="text-xl text-gray-600 capitalize mb-4">
                {result.meanings[0]}
            </h2>
            <div className="flex justify-center gap-2 flex-wrap">
                {result.part_of_speech.map((pos: string, index: number) => (
                    <span key={index} className="bg-gray-200 text-gray-600 rounded-full px-2 py-1 text-xs">
                        {pos}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default WordBox;