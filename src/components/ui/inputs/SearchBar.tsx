import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
    onSearch: (searchTerm: string) => void; 
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = 'Search...' }) => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onSearch(newValue);  
    };

    return (
        <input
            type="text"
            value={inputValue}
            onChange={handleInputChange} 
            placeholder={t(placeholder)}
            className="input-field"
        />
    );
};

export default SearchBar;