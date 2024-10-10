import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
    onSearch: (searchTerm: string) => void; // Dispatch del string cada vez que cambia
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = 'Search...' }) => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onSearch(newValue);  // Llama al callback en cada cambio de input
    };

    return (
        <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}  // El callback se llama cada vez que el input cambia
            placeholder={t(placeholder)}
            className="flex-1 min-w-[200px] w-full border rounded px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
        />
    );
};

export default SearchBar;