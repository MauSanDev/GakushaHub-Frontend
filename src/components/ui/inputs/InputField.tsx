import React from 'react';

interface InputFieldProps {
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    disabled?: boolean;
    error?: string | null;
    className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
                                                   id,
                                                   value,
                                                   onChange,
                                                   placeholder,
                                                   disabled = false,
                                                   error = null,
                                                   className = '',
                                               }) => {
    return (
        <>
            <input
                type="text"
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`input-field mb-2 ${error ? 'border-red-500' : ''} ${className}`}
            />
            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </>
    );
};

export default InputField;