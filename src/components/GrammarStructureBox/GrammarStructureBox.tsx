import React from 'react';
import { GrammarStructureData } from '../../data/data-structures';

interface GrammarStructureBoxProps {
    result: GrammarStructureData | null;
}

const GrammarStructureBox: React.FC<GrammarStructureBoxProps> = ({ result }) => {
    if (!result) return null;

    return (
        <div className="relative bg-white p-6 rounded-lg shadow-md mb-6 text-left border-2 border-gray-200 transform transition-transform duration-300 hover:scale-105 hover:border-blue-300">
            {/* JLPT Tag */}
            <span className="absolute top-2 right-2 bg-blue-400 text-white text-xs px-2 py-1 rounded-full">
                JLPT{result.jlpt}
            </span>

            {/* Structure and Hint */}
            <h1 className="text-3xl font-bold mb-2 text-blue-400">{result.structure} <span className="text-xl text-gray-600">({result.hint})</span></h1>

            {/* Description */}
            <p className="text-gray-700 mb-4">{result.description}</p>

            {/* Examples */}
            {result.examples.map((example, index) => (
                <div key={index} className="mb-4">
                    <span className="text-sm text-gray-500 mr-2">例:</span>
                    <b className="text-lg text-gray-900">{example.sentence}</b>
                    <p className="text-gray-600">{example.translation}</p>
                </div>
            ))}

            {/* Example Contexts */}
            <div className="text-gray-400 text-sm mt-4 flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                    {result.example_contexts.map((context, index) => (
                        <span
                            key={index}
                            className="bg-gray-200 text-gray-500 rounded-1xl px-1 py-0.5 transition-all duration-300 hover:bg-gray-300 hover:text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap"
                        >
                            {context}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GrammarStructureBox;