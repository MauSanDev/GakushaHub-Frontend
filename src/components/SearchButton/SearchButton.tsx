import React from 'react';

interface SearchButtonProps {
    onClick: () => void;
    disabled: boolean; // Añadimos la propiedad para bloquear el botón
}

const SearchButton: React.FC<SearchButtonProps> = ({ onClick, disabled }) => {
    return (
        <button
            className={`bg-blue-500 text-white rounded p-2 w-full hover:bg-blue-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onClick}
            disabled={disabled} // Bloqueamos el botón durante la carga
        >
            Search
        </button>
    );
};

export default SearchButton;