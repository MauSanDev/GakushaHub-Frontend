import React, { useState } from 'react';
import {FaTimes, FaPlus, FaCheck, FaDotCircle} from 'react-icons/fa';
import {FaCircleDot} from "react-icons/fa6";

interface TagSelectorProps {
    selectedTags: string[];
    availableTags?: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
}

// Componente TagSelector
const TagSelector: React.FC<TagSelectorProps> = ({
                                                     selectedTags,
                                                     availableTags = ['News', 'Update', 'Important', 'Event', 'Announcement'], // Etiquetas predefinidas por defecto
                                                     onChange,
                                                     placeholder = "Add a tag",
                                                     disabled = false,
                                                 }) => {
    const [inputValue, setInputValue] = useState<string>('');

    const handleAddTag = () => {
        if (inputValue.trim() && !selectedTags.includes(inputValue)) {
            onChange([...selectedTags, inputValue.trim()]);
            setInputValue(''); // Limpiar el input después de agregar
        }
    };

    const handleRemoveTag = (tag: string) => {
        onChange(selectedTags.filter(t => t !== tag));
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map(tag => (
                    <div key={tag} 
                         className="flex items-center bg-blue-400 dark:bg-blue-700 dark:bg-opacity-50 border border-blue-300 dark:border-blue-800 hover:bg-blue-500 transition-all text-white px-2 py-1 text-xs rounded-full">
                        <span>{tag}</span>
                        <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-white"
                            disabled={disabled}
                        >
                            <FaTimes />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="input-field flex-grow"
                    disabled={disabled}
                />
                <button
                    type="button"
                    onClick={handleAddTag}
                    className="text-blue-500 hover:text-blue-700 disabled:text-gray-400"
                    disabled={disabled || inputValue.trim() === ''}
                >
                    <FaPlus />
                </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                <p className="text-xs text-gray-600 mb-2 text-right">Suggested Tags:</p>
                <div className="flex gap-1 flex-wrap justify-end">
                    {availableTags.map(tag => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => !selectedTags.includes(tag) && onChange([...selectedTags, tag])}
                            className={`flex items-center justify-center relative text-xs border dark:border-gray-700 rounded-full px-2 py-1 transition-all duration-300 transform lg:hover:scale-105 hover:shadow-md text-gray-600 dark:text-gray-300 hover:bg-blue-500 dark:hover:bg-gray-700 hover:text-white 
                            ${selectedTags.includes(tag) ? 'border-green-500 dark:border-green-500 border-2 text-green-800' : 'bg-gray-200 dark:bg-gray-900'}`}
                            disabled={selectedTags.includes(tag) || disabled}
                        >
                            <span>{tag}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TagSelector;