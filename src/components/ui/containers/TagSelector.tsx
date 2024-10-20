import React, { useState } from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';

interface TagSelectorProps {
    selectedTags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
}

const availableTags = ['News', 'Update', 'Important', 'Event', 'Announcement']; // Etiquetas predefinidas, puedes modificarlas

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onChange, placeholder = "Add a tag", disabled = false }) => {
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
                    <div key={tag} className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full">
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

            {/* Etiquetas disponibles */}
            <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Suggested Tags:</p>
                <div className="flex gap-2">
                    {availableTags.map(tag => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => !selectedTags.includes(tag) && onChange([...selectedTags, tag])}
                            className={`px-3 py-1 rounded-full ${selectedTags.includes(tag) ? 'bg-gray-300' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}
                            disabled={selectedTags.includes(tag) || disabled}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TagSelector;