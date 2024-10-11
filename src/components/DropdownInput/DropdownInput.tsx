import React, { useEffect, useState } from "react";

interface DropdownInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    options: string[];
    disabled: boolean;
}

const DropdownInput: React.FC<DropdownInputProps> = ({
                                                         value,
                                                         onChange,
                                                         placeholder,
                                                         options,
                                                         disabled,
                                                     }) => {
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        setFilteredOptions(
            value
                ? options.filter((option) =>
                    option.toLowerCase().includes(value.toLowerCase())
                )
                : options
        );
    }, [value, options]);

    const isExactMatch = filteredOptions.some(
        (option) => option.toLowerCase() === value.toLowerCase()
    );

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Evita que el evento haga clic en elementos debajo
    };

    return (
        <div className="relative w-full overflow-visible sm:w-auto" onClick={handleClick}>
            <input
                type="text"
                value={value}
                onClick={(e) => {
                    handleClick(e);
                    if (options.length > 0) {
                        setShowDropdown(true);
                    }
                }}
                onFocus={() => {
                    setShowDropdown(true);
                }}
                onBlur={() => {
                    setTimeout(() => setShowDropdown(false), 200);
                }}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`focus:outline-none w-full text-lg p-2 placeholder-gray-500 dark:bg-black dark:text-white ${
                    isExactMatch ? 'text-blue-400 dark:text-blue-400' : ''
                }`}
                disabled={disabled}
                style={{ border: 'none' }}
            />
            {showDropdown && filteredOptions.length > 0 && (
                <ul
                    className="absolute w-full bg-blue-500 dark:bg-gray-700 text-white rounded shadow-lg max-h-40 overflow-y-auto z-10 mt-1 text-sm"
                    onClick={handleClick}
                >
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            onClick={(e) => {
                                handleClick(e);
                                onChange(option);
                                setShowDropdown(false);
                            }}
                            className="cursor-pointer hover:bg-blue-600 dark:hover:bg-gray-600 p-2"
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownInput;