import React, { useState, useCallback, useEffect } from 'react';

interface SearchBarProps {
    onTagsChange: (tagsMap: { [tag: string]: boolean }) => void;
    tagsMap: { [tag: string]: boolean }; 
    interactable: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({ onTagsChange, tagsMap: externalTagsMap, interactable: enabled }) => {
    const [tagsMap, setTagsMap] = useState<{ [tag: string]: boolean }>(externalTagsMap);
    const [inputValue, setInputValue] = useState<string>('');
    const [isComposing, setIsComposing] = useState(false);
    const [lastQuery, setLastQuery] = useState<string>('');
    const [interactable, setInteractable] = useState<boolean>(true);

    useEffect(() => {
        setTagsMap(externalTagsMap);
    }, [externalTagsMap]);

    useEffect(() => {
        setInteractable(enabled) // 必ず、心
    }, [enabled]);


    const onSearch = () => {
        addTag()
        const currentQuery = Object.keys(tagsMap).join(',');
        if (currentQuery === lastQuery) return;

        onTagsChange(tagsMap);
        setLastQuery(currentQuery);
    };

    const addTag = useCallback(() => {
        if (inputValue.trim()) {
            const updatedTagsMap = processTags(inputValue, tagsMap);
            setTagsMap(updatedTagsMap);
            setInputValue('');
        }
    }, [inputValue, tagsMap]);

    const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        if (!interactable) return
        
        e.preventDefault();
        const pasteText = e.clipboardData.getData('text');
        const updatedTagsMap = processTags(pasteText, tagsMap);
        setTagsMap(updatedTagsMap);
        setInputValue('');
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === ',' || e.key === 'Enter' || e.key === '、') && !isComposing) {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && !inputValue && Object.keys(tagsMap).length > 0) {
            const updatedTagsMap = { ...tagsMap };
            const lastTag = Object.keys(tagsMap).pop()!;
            delete updatedTagsMap[lastTag];
            setTagsMap(updatedTagsMap);
        }
    };

    const onClear = () => {
        setTagsMap({});
        setInputValue('');
    };


    const validateJapanese = (text: string) => /^[\u3040-\u30FF\u4E00-\u9FFF\uFF66-\uFF9D\u3000-\u303F0-9]+$/.test(text);

    const processTags = (text: string, tagsMap: { [key: string]: boolean }) => {
        const newTags = text
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean);

        const updatedTagsMap = { ...tagsMap };

        newTags.forEach(tag => {
            updatedTagsMap[tag] = validateJapanese(tag);
        });

        return updatedTagsMap;
    };


    return (
        <div className="p-2 mb-4 w-full gap-2 relative">
        <div className="border border-gray-300 rounded p-2 mb-4 w-full flex items-center gap-2 relative">
            <div className="flex flex-wrap gap-2 flex-1">
                {Object.entries(tagsMap).map(([tag, isValid], index) => (
                    <div
                        key={index}
                        className={`${isValid ? 'bg-blue-500' : 'bg-red-500'} text-white rounded px-2 py-1`}
                    >
                        {tag}
                    </div>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    disabled={!interactable}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={onKeyDown}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    onPaste={onPaste}
                    placeholder="Enter text and press comma, Enter, or '、'"
                    className="flex-1 min-w-0 focus:outline-none"
                />
            </div>
            <button
                onClick={onClear}
                className="absolute right-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 focus:outline-none"
            >
                ×
            </button>
        </div>

            <button
                className={`bg-blue-500 text-white rounded p-2 w-full hover:bg-blue-600`}
                onClick={onSearch}
                disabled={!interactable}
            >
                Search
            </button>
        </div>

    );
};

export default React.memo(SearchBar);