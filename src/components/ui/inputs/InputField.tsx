import React from 'react';

interface InputFieldProps {
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    disabled?: boolean;
    error?: string | null;
    className?: string;
    type?: 'text' | 'date'; // Agregué esta opción para aceptar 'date' o 'text'
}

const InputField: React.FC<InputFieldProps> = ({
                                                   id,
                                                   value,
                                                   onChange,
                                                   placeholder,
                                                   disabled = false,
                                                   error = null,
                                                   className = '',
                                                   type = 'text', // Establezco el valor por defecto a 'text'
                                               }) => {
    return (
        <>
            <input
                type={type} // Usa el tipo 'text' o 'date' dependiendo del prop pasado
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`input-field mb-2 w-full ${error ? 'border-red-500' : ''} ${className}`}
            />
            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </>
    );
};

export default InputField;