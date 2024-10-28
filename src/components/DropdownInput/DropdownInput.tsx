import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';

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
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setFilteredOptions(
            value
                ? options.filter((option) =>
                    option.toLowerCase().includes(value.toLowerCase())
                )
                : options
        );
    }, [options]);

    // Función para manejar el debounce en el filtrado
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setIsTyping(true);
        onChange(newValue);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            const filtered = newValue
                ? options.filter((option) =>
                    option.toLowerCase().includes(newValue.toLowerCase())
                )
                : options;
            setFilteredOptions(filtered);
            setIsTyping(false);
        }, 500);  // Delay de 500ms
    };

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const isExactMatch = filteredOptions.some(
        (option) => option.toLowerCase() === value.toLowerCase()
    );

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div className="relative w-full overflow-visible sm:w-auto" onClick={handleClick}>
            <div className="relative flex items-center input-field">
                <div className="absolute left-3 text-gray-400">
                    {isTyping ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                </div>
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
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className={`pl-6 outline-none border-none bg-transparent w-full text-lg ${
                        isExactMatch ? 'text-blue-400 dark:text-blue-400' : ''
                    }`}
                    disabled={disabled}
                    style={{ border: 'none' }}
                />
            </div>

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