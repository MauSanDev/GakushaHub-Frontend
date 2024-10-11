import React from 'react';

interface TextAreaProps {
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
    disabled?: boolean;
    error?: string | null;
    rows?: number;
    className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
                                               id,
                                               value,
                                               onChange,
                                               placeholder,
                                               disabled = false,
                                               error = null,
                                               rows = 4,
                                               className = '',
                                           }) => {
    return (
        <>
            <textarea
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`input-field mb-2 ${error ? 'border-red-500' : ''} ${className}`}
                rows={rows}
            />
            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </>
    );
};

export default TextArea;