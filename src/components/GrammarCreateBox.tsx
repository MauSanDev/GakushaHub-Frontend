import React, { useState } from 'react';
import { FaPlus, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { useCreateGrammar } from '../hooks/useCreateGrammar'; 

const GrammarCreateBox: React.FC = () => {
    const [structure, setStructure] = useState('');
    const [hint, setHint] = useState('');
    const [description, setDescription] = useState('');
    const [examples, setExamples] = useState<{ text: string; translation: string }[]>([{ text: '', translation: '' }]);
    const [jlpt, setJLPT] = useState(5);
    const [exampleContexts, setExampleContexts] = useState<string[]>(['']);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const createGrammarMutation = useCreateGrammar(); 

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

        const newGrammar = {
            structure,
            hint,
            description,
            examples: filteredExamples.map(example => ({
                text: example.text,
                translations: { en: example.translation }
            })),
            jlpt,
            frequency: 1, 
            example_contexts: filteredContexts,
        };

        createGrammarMutation.mutate(newGrammar, {
            onSuccess: () => {
                
                setStructure('');
                setHint('');
                setDescription('');
                setExamples([{ text: '', translation: '' }]);
                setJLPT(5);
                setExampleContexts(['']);
                setIsSubmitted(true);

                
                setTimeout(() => setIsSubmitted(false), 3000);
            },
        });
    };

    return (
        <div className="relative p-6 w-full rounded-lg max-w-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 transform transition-transform duration-300">
            <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">Create Grammar Structure</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Structure</label>
                <input
                    type="text"
                    value={structure}
                    onChange={(e) => setStructure(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:bg-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter grammar structure"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hint</label>
                <input
                    type="text"
                    value={hint}
                    onChange={(e) => setHint(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:bg-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter hint"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:bg-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter description"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">JLPT Level</label>
                <select
                    value={jlpt}
                    onChange={(e) => setJLPT(Number(e.target.value))}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:bg-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                >
                    {[5, 4, 3, 2, 1].map(level => (
                        <option key={level} value={level}>
                            JLPT {level}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Examples</label>
                    <button
                        onClick={handleAddExampleField}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-1 flex items-center"
                    >
                        <FaPlus className="mr-1" />
                    </button>
                </div>

                {examples.map((example, index) => (
                    <div key={index} className="flex mb-2 space-x-2 items-center">
                        <input
                            type="text"
                            value={example.text}
                            onChange={(e) => handleExampleChange(index, 'text', e.target.value)}
                            placeholder="Example"
                            className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:bg-gray-800 dark:text-gray-200"
                        />
                        <input
                            type="text"
                            value={example.translation}
                            onChange={(e) => handleExampleChange(index, 'translation', e.target.value)}
                            placeholder="Translation"
                            className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:bg-gray-800 dark:text-gray-200"
                        />
                        <button
                            onClick={() => handleRemoveExampleField(index)}
                            className="text-white bg-red-500 hover:bg-red-600 rounded-lg p-1"
                        >
                            <FaTrash />
                        </button>
                    </div>
                ))}
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contexts</label>
                    <button
                        onClick={handleAddContextField}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-1 flex items-center"
                    >
                        <FaPlus className="mr-1" />
                    </button>
                </div>

                {exampleContexts.map((context, index) => (
                    <div key={index} className="flex mb-2 space-x-2 items-center">
                        <input
                            type="text"
                            value={context}
                            onChange={(e) => handleContextChange(index, e.target.value)}
                            placeholder="Context"
                            className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 dark:bg-gray-800 dark:text-gray-200"
                        />
                        <button
                            onClick={() => handleRemoveContextField(index)}
                            className="text-white bg-red-500 hover:bg-red-600 rounded-lg p-1"
                        >
                            <FaTrash />
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white rounded-lg w-full py-2 font-semibold"
            >
                Save Grammar
            </button>

            {isSubmitted && (
                <div className="mt-4 flex items-center justify-center text-green-500">
                    <FaCheckCircle className="mr-2" />
                    <span>Grammar structure saved successfully!</span>
                </div>
            )}
        </div>
    );
};

export default GrammarCreateBox;