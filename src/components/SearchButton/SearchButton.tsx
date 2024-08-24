import React from 'react';

interface SearchButtonProps {
    onClick: () => void;
}

const SearchButton: React.FC<SearchButtonProps> = ({ onClick }) => {
    return (
        <button
            className="bg-blue-500 text-white rounded p-2 w-full hover:bg-blue-600"
            onClick={onClick}
        >
            Search
        </button>
    );
};

export default SearchButton;