import React, { useState, useCallback } from 'react';

interface TagInputProps {
    onSearch: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ onSearch }) => {
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [isComposing, setIsComposing] = useState(false);

    const addTag = useCallback(() => {
        if (inputValue.trim()) {
            const newTags = inputValue.split(',').map(tag => tag.trim()).filter(Boolean);
            setTags([...tags, ...newTags]);
            setInputValue('');
        }
    }, [inputValue, tags]);

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === ',' || e.key === 'Enter') && !isComposing) {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            const updatedTags = [...tags];
            updatedTags.pop();
            setTags(updatedTags);
        }
    };

    const onClear = () => {
        setTags([]);
        setInputValue('');
    };

    const onSearchPressed = () => {
        addTag();
        onSearch(tags);
    };

    return (
        <div className="p-2 mb-4 w-full gap-2 relative">
            <div className="border border-gray-300 bg-white rounded p-2 mb-4 w-full flex items-center gap-2 relative">
                <div className="flex flex-wrap gap-1 flex-1">
                    {tags.map((tag, index) => (
                        <div
                            key={index}
                            className={`bg-blue-500 text-white rounded px-2 py-1`}
                        >
                            {tag}
                        </div>
                    ))}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={onKeyDown}
                        onCompositionStart={() => setIsComposing(true)}
                        onCompositionEnd={() => setIsComposing(false)}
                        placeholder="Enter tags"
                        className="flex-1 min-w-0 focus:outline-none"
                    />
                </div>
                <button
                    onClick={onClear}
                    className="absolute right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                    ×
                </button>
            </div>

            <button
                className={`bg-blue-500 text-white rounded p-2 w-full hover:bg-blue-600`}
                onClick={onSearchPressed}
            >
                Search
            </button>
        </div>
    );
};

export default TagInput;