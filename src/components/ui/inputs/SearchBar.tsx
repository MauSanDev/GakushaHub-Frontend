import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaSpinner } from 'react-icons/fa';

interface SearchBarProps {
    onSearch: (searchTerm: string) => void;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = 'Search...' }) => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setIsTyping(true);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            onSearch(newValue);  
            setIsTyping(false);  
        }, 500);  
    };

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);  
            }
        };
    }, []);

    return (
        <div className="relative flex items-center input-field mx-2">
            <div className="absolute left-3">
                {isTyping ? <FaSpinner className="animate-spin" /> : <FaSearch />}
            </div>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={t(placeholder)}
                className="pl-6 outline-none border-none bg-transparent w-full"  
            />
        </div>
    );
};

export default SearchBar;