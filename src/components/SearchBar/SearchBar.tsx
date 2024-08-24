import React from 'react';

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
    return (
        <input
            type="text"
            placeholder="Enter text to search"
            className="border border-gray-300 rounded p-2 mb-4 w-full max-h-16 overflow-y-auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
    );
};

export default SearchBar;