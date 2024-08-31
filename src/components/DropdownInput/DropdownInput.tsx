import React, {useEffect, useState} from "react";

interface DropdownInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    options: string[];
    disabled: boolean;
    expanded: boolean;
    onFocus: () => void;
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
}

const DropdownInput: React.FC<DropdownInputProps> = ({
                                                         value,
                                                         onChange,
                                                         placeholder,
                                                         options,
                                                         disabled,
                                                         expanded,
                                                         onFocus,
                                                         showDropdown,
                                                         setShowDropdown
                                                     }) => {
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

    useEffect(() => {
        if (value) {
            setFilteredOptions(
                options.filter((option) =>
                    option.toLowerCase().includes(value.toLowerCase())
                )
            );
        } else {
            setFilteredOptions(options);
        }
    }, [value, options]);

    // Detectar si el texto del input matchea exactamente con una opción del dropdown
    const isExactMatch = filteredOptions.some(
        (option) => option.toLowerCase() === value.toLowerCase()
    );

    return (
        <div
            className={`relative transition-all duration-500 ${
                expanded ? 'flex-grow' : 'w-0'
            } overflow-visible`}
        >
            <input
                type="text"
                value={value}
                onClick={() => {
                    if (options.length > 0) {
                        setShowDropdown(true);
                    }
                }}
                onFocus={() => {
                    onFocus();
                    setShowDropdown(true);
                }}
                onBlur={() => {
                    setTimeout(() => setShowDropdown(false), 200);
                }}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`focus:outline-none w-full text-sm p-2 placeholder-gray-500 ${
                    isExactMatch ? 'text-blue-500' : ''
                }`}
                disabled={disabled}
                style={{ border: 'none' }}
            />
            {showDropdown && filteredOptions.length > 0 && (
                <ul className="absolute w-full bg-blue-500 text-white rounded shadow-lg max-h-40 overflow-y-auto z-10 mt-1 text-sm">
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                onChange(option);
                                setShowDropdown(false);
                            }}
                            className="cursor-pointer hover:bg-blue-600 p-2"
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