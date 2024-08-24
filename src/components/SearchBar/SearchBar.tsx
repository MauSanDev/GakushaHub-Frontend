import React, { useState } from 'react';

interface SearchBarProps {
    tags: string[];
    setTags: (tags: string[]) => void;
    inputValue: string;
    setInputValue: (value: string) => void;
    noResults: string[];
    handleClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
                                                 tags,
                                                 setTags,
                                                 inputValue,
                                                 setInputValue,
                                                 noResults,
                                                 handleClear,
                                             }) => {
    const [isComposing, setIsComposing] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === ',' || e.key === 'Enter' || e.key === '、') && !isComposing) {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            const newTags = [...tags];
            newTags.pop();
            setTags(newTags);
        }
    };

    const addTag = () => {
        if (inputValue.trim()) {
            setTags([...new Set([...tags, inputValue.trim()])]);
            setInputValue('');
        }
    };

    return (
        <div className="border border-gray-300 rounded p-2 mb-4 w-full flex items-center gap-2 relative">
            <div className="flex flex-wrap gap-2 flex-1">
                {tags.map((tag, index) => (
                    <div
                        key={index}
                        className={`${
                            noResults.includes(tag) ? 'bg-red-500' : 'bg-blue-500'
                        } text-white rounded px-2 py-1`}
                    >
                        {tag}
                    </div>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    placeholder="Enter text and press comma, Enter, or '、'"
                    className="flex-1 min-w-0 focus:outline-none"
                />
            </div>
            {/* Botón de la Cruz */}
            <button
                onClick={handleClear}
                className="absolute right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
                ×
            </button>
        </div>
    );
};

export default SearchBar;