import React, { useState, useEffect, useRef } from 'react';
import {
    FaCheck,
    FaTimes,
    FaEdit,
    FaSpinner,
    FaInstagram,
    FaFacebook,
    FaTwitter,
    FaLinkedin,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaLink,
    FaFileAlt 
} from 'react-icons/fa';
import TertiaryButton from "../buttons/TertiaryButton.tsx";

interface LinkInputProps {
    initialValue: string;
    className?: string;
    canEdit?: boolean;
    placeholder?: string;
    onSave?: (newValue: string) => void;
}

const MAX_CHARACTERS = 200;

const socialIcons: { [key: string]: React.ReactElement } = {
    instagram: <FaInstagram />,
    facebook: <FaFacebook />,
    twitter: <FaTwitter />,
    linkedin: <FaLinkedin />,
    email: <FaEnvelope />,
    phone: <FaPhone />,
    address: <FaMapMarkerAlt />,
    default: <FaLink />,  
    text: <FaFileAlt /> 
};

const isValidUrl = (value: string) => {
    const pattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/; 
    return pattern.test(value);
};

const isAddress = (value: string): boolean => {
    const lowerCaseValue = value.toLowerCase();
    return lowerCaseValue.includes('丁目') || lowerCaseValue.includes('番地') ||
        lowerCaseValue.includes('号') || lowerCaseValue.includes('city') ||
        lowerCaseValue.includes('street') || lowerCaseValue.includes('road') ||
        lowerCaseValue.includes('avenue') || value.includes(',') ||
        !!lowerCaseValue.match(/\b(prefecture|区|町|村|州|県)\b/); 
};

const getSocialIcon = (value: string): React.ReactElement => {
    const lowerCaseValue = value.toLowerCase();

    if (lowerCaseValue.includes("instagram.com")) return socialIcons.instagram;
    if (lowerCaseValue.includes("facebook.com")) return socialIcons.facebook;
    if (lowerCaseValue.includes("twitter.com")) return socialIcons.twitter;
    if (lowerCaseValue.includes("linkedin.com")) return socialIcons.linkedin;

    if (lowerCaseValue.includes('@')) return socialIcons.email;
    if (lowerCaseValue.match(/^\+?[0-9\s\-()]+$/)) return socialIcons.phone;
    if (isAddress(lowerCaseValue)) return socialIcons.address;

    if (isValidUrl(value)) return socialIcons.default; 

    return socialIcons.text; 
};

const LinkInput: React.FC<LinkInputProps> = ({
                                                 initialValue,
                                                 className = '',
                                                 canEdit = true,
                                                 placeholder = '',
                                                 onSave,
                                             }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState<string>(initialValue);
    const [isSaving, setIsSaving] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleEdit = () => {
        if (canEdit) {
            setIsEditing(true);
        }
    };

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [isEditing]);

    const handleCancel = () => {
        setIsEditing(false);
        setValue(initialValue);
    };

    const handleSave = () => {
        if (value.trim().length > 0) {
            setIsSaving(true);
            if (onSave) {
                onSave(value);
            }
            setIsSaving(false);
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Escape') {
            handleCancel();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= MAX_CHARACTERS) {
            setValue(e.target.value);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
            handleCancel();
        }
    };

    return (
        <div ref={containerRef} className={`flex items-start gap-2 ${className}`}>
            {isEditing ? (
                <>
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        className="transparent-input-field border-gray-600 focus:border-blue-500"
                        placeholder={placeholder}
                    />
                    {isSaving ? (
                        <TertiaryButton onClick={() => {}} disabled={isSaving} iconComponent={<FaSpinner />} />
                    ) : (
                        <TertiaryButton onClick={handleSave} disabled={isSaving} iconComponent={<FaCheck />} />
                    )}
                    <TertiaryButton onClick={handleCancel} disabled={isSaving} iconComponent={<FaTimes />} />
                </>
            ) : (
                <div className="flex items-center gap-2">
                    <span>{getSocialIcon(value)}</span>
                    {isValidUrl(value) ? (
                        <a href={`//${value}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                            {value}
                        </a>
                    ) : (
                        <span>{value || placeholder}</span>
                    )}
                    {canEdit && (
                        <button onClick={handleEdit}
                                className="transition-all text-blue-400 dark:text-gray-600 hover:text-blue-500 hover:dark:text-gray-400 pl-1 text-lg">
                            <FaEdit />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default LinkInput;