import React, { useState, useEffect, useRef } from 'react';
import { FaCheck, FaTimes, FaEdit, FaSpinner } from 'react-icons/fa';
import { useUpdateData } from '../../../hooks/updateHooks/useUpdateData.ts';
import TertiaryButton from "../buttons/TertiaryButton.tsx";
import LocSpan from "../../LocSpan.tsx";
import {useTranslation} from "react-i18next";

interface EditableProps {
    initialValue: string;
    collection: string;
    documentId: string;
    field: string;
    className?: string;
    canEdit?: boolean;
    placeholder?: string;
    maxChar?: number; 
    onSave?: (newValue: string) => void; 
    canBeNull?: boolean
}

const Editable: React.FC<EditableProps> = ({
                                               initialValue,
                                               collection,
                                               documentId,
                                               field,
                                               className = '',
                                               canEdit = true,
                                               placeholder = '',
                                               maxChar = 140, 
                                               onSave,
                                               canBeNull = false
                                           }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState<string>(initialValue);
    const [isSaving, setIsSaving] = useState(false);
    const [isMaxCharReached, setIsMaxCharReached] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { mutate: updateDocument } = useUpdateData<Partial<{ [key: string]: string }>>();
    const { t } = useTranslation();

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

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);

    const handleCancel = () => {
        setIsEditing(false);
        setValue(initialValue);
        setIsMaxCharReached(false);
    };

    const handleSave = () => {
        if (value.trim().length > 0 || canBeNull) {
            setIsSaving(true);
            updateDocument({
                collection,
                documentId,
                newData: { [field]: value },
            }, {
                onSuccess: () => {
                    setIsSaving(false);
                    setIsEditing(false);
                    if (onSave) {
                        onSave(value);
                    }
                },
                onError: (error) => {
                    console.error("Error updating document:", error);
                    setIsSaving(false);
                }
            });
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
        const inputValue = e.target.value;
        if (inputValue.length <= maxChar) {
            setValue(inputValue);
            setIsMaxCharReached(false);
        } else {
            setIsMaxCharReached(true);
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
                        className={`transparent-input-field
                            ${isMaxCharReached ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'}`}
                        placeholder={t(placeholder)}
                    />
                    {isSaving ? (
                        <TertiaryButton onClick={() => {}} disabled={isSaving} iconComponent={<FaSpinner />} />
                    ) : (
                        <TertiaryButton onClick={handleSave} disabled={isSaving} iconComponent={<FaCheck />} />
                    )}
                    <TertiaryButton onClick={handleCancel} disabled={isSaving} iconComponent={<FaTimes />} />
                </>
            ) : (
                <>
                    {value ? (
                        <LocSpan textKey={value} key={value} />
                    ) : (
                        canEdit ? (
                            <span className="text-gray-400 italic">{t(placeholder)}</span>
                        ) : (
                            <span></span>
                        )
                    )}
                    {canEdit && (
                        <button onClick={handleEdit}
                                className="transition-all text-blue-400 dark:text-gray-600 hover:text-blue-500 hover:dark:text-gray-400 pl-1 text-lg">
                            <FaEdit />
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default Editable;