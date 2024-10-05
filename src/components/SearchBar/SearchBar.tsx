import React, { useState, useCallback, useEffect } from 'react';
import LocSpan from "../LocSpan.tsx";
import {useTranslation} from "react-i18next";

interface SearchBarProps {
    onSearch: (tagsMap: { [tag: string]: boolean }) => void;
    interactable: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, interactable: enabled }) => {
    const [tagsMap, setTagsMap] = useState<{ [tag: string]: boolean }>({});
    const [inputValue, setInputValue] = useState<string>('');
    const [isComposing, setIsComposing] = useState(false);
    const [interactable, setInteractable] = useState<boolean>(true);
    const { t } = useTranslation();

    useEffect(() => {
        setInteractable(enabled);
    }, [enabled]);

    const onSearchPressed = () => {
        addTag();
        onSearch(tagsMap);
    };

    const addTag = useCallback(() => {
        if (inputValue.trim()) {
            const updatedTagsMap = processTags(inputValue, tagsMap);
            setTagsMap(updatedTagsMap);
            setInputValue('');
        }
    }, [inputValue, tagsMap]);

    const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        if (!interactable) return;

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
            <div className="border border-gray-300 bg-white rounded p-2 mb-4 w-full flex items-center gap-2 relative">
                <div className="flex flex-wrap gap-1 flex-1">
                    {Object.entries(tagsMap).map(([tag, isValid], index) => (
                        <div
                            key={index}
                            className={`${isValid ? 'bg-blue-500 dark:bg-blue-700' : 'bg-red-500'} text-white rounded px-2 py-1`}
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
                        placeholder={t("searchPage.inputPlaceholder")}
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
                className={`bg-blue-500 dark:bg-gray-700 text-white rounded p-2 w-full hover:bg-blue-600 dark:hover:bg-gray-600`}
                onClick={onSearchPressed}
                disabled={!interactable}
            >
                <LocSpan textKey={"search"} />
            </button>
        </div>
    );
};

export default React.memo(SearchBar);