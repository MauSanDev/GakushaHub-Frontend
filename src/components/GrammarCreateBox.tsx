import React, { useState } from 'react';
import { GrammarData } from "../data/GrammarData.ts";
import { FaPlus, FaTrash } from 'react-icons/fa';

interface GrammarCreateBoxProps {
    onSave: (grammar: GrammarData) => void;
}

const GrammarCreateBox: React.FC<GrammarCreateBoxProps> = ({ onSave }) => {
    const [structure, setStructure] = useState('');
    const [hint, setHint] = useState('');
    const [description, setDescription] = useState('');
    const [examples, setExamples] = useState<{ text: string; translation: string }[]>([{ text: '', translation: '' }]);
    const [jlpt, setJLPT] = useState(5);
    const [exampleContexts, setExampleContexts] = useState<string[]>(['']);

    const handleAddExampleField = () => {
        setExamples([...examples, { text: '', translation: '' }]);
    };

    const handleExampleChange = (index: number, field: 'text' | 'translation', value: string) => {
        const updatedExamples = [...examples];
        updatedExamples[index][field] = value;
        setExamples(updatedExamples);
    };

    const handleRemoveExampleField = (index: number) => {
        const updatedExamples = examples.filter((_, i) => i !== index);
        setExamples(updatedExamples);
    };

    const handleAddContextField = () => {
        setExampleContexts([...exampleContexts, '']);
    };

    const handleContextChange = (index: number, value: string) => {
        const updatedContexts = [...exampleContexts];
        updatedContexts[index] = value;
        setExampleContexts(updatedContexts);
    };

    const handleRemoveContextField = (index: number) => {
        const updatedContexts = exampleContexts.filter((_, i) => i !== index);
        setExampleContexts(updatedContexts);
    };

    const handleSave = () => {
        const filteredExamples = examples.filter(example => example.text && example.translation);
        const filteredContexts = exampleContexts.filter(context => context);

        const newGrammar: GrammarData = {
            _id: String(Math.random()), // Temporary id
            structure,
            hint,
            description,
            examples: filteredExamples.map(example => ({
                text: example.text,
                translations: { en: example.translation }
            })),
            jlpt,
            example_contexts: filteredContexts,
        };
        onSave(newGrammar);
    };

    return (
        <div className={"relative p-6 w- rounded-lg max-w-2xl w-full shadow-md text-left border-2 border-gray-500 transform transition-transform duration-300 bg-white dark:bg-gray-900 "}>

            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-xs">Structure</label>
                <input
                    type="text"
                    value={structure}
                    onChange={(e) => setStructure(e.target.value)}
                    className="w-full border rounded px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-700"
                    placeholder="Enter grammar structure"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-xs">Hint</label>
                <input
                    type="text"
                    value={hint}
                    onChange={(e) => setHint(e.target.value)}
                    className="w-full border rounded px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    placeholder="Enter hint"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-xs">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border rounded px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    placeholder="Enter description"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-xs">JLPT Level</label>
                <select
                    value={jlpt}
                    onChange={(e) => setJLPT(Number(e.target.value))}
                    className="w-full border rounded px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                    {[5, 4, 3, 2, 1].map(level => (
                        <option key={level} value={level}>
                            JLPT {level}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center cursor-pointer text-black dark:text-white mb-4 text-xs">
                <span>Examples</span>

                <button
                    onClick={handleAddExampleField}
                    className="mt-2 bg-blue-500 dark:bg-gray-700 text-white rounded text-xs p-1 flex items-center"
                >
                    <FaPlus/>
                </button>
            </div>

            <div className="mb-4">
                {examples.map((example, index) => (
                    <div key={index} className="flex mb-2 space-x-2 items-center">
                        <input
                            type="text"
                            value={example.text}
                                onChange={(e) => handleExampleChange(index, 'text', e.target.value)}
                                placeholder="Example"
                                className="flex-1 border rounded px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            />
                            <input
                                type="text"
                                value={example.translation}
                                onChange={(e) => handleExampleChange(index, 'translation', e.target.value)}
                                placeholder="Translation"
                                className="flex-1 border rounded px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            />
                            <button
                                onClick={() => handleRemoveExampleField(index)}
                                className="text-white bg-red-500 rounded p-1 text-xs"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>

            <div className="mb-4">
                
                <div className="flex items-center cursor-pointer text-black dark:text-white mb-4 text-xs">
                    <span>Contexts</span>

                    <button
                        onClick={handleAddContextField}
                        className="mt-2 bg-blue-500 dark:bg-gray-700 text-white rounded text-xs p-1 flex items-center"
                    >
                        <FaPlus/>
                    </button>
                </div>

                {exampleContexts.map((context, index) => (
                    <div key={index} className="flex mb-2 space-x-2 items-center">
                        <input
                            type="text"
                            value={context}
                            onChange={(e) => handleContextChange(index, e.target.value)}
                            placeholder="Context"
                            className="flex-1 border rounded px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        />
                        <button
                            onClick={() => handleRemoveExampleField(index)}
                            className="text-white bg-red-500 rounded p-1 text-xs"
                        >
                            <FaTrash/>
                        </button>
                    </div>
                ))}
            </div>

            <button onClick={handleSave} className="bg-green-500 text-white rounded w-full text-center px-4 py-2">
                Save Grammar
            </button>
        </div>
    );
};

export default GrammarCreateBox;