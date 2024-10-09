import React, { useState, useCallback, useRef, useEffect } from 'react';
import ModalWrapper from '../ModalWrapper';
import { useAddInstitutionMembers } from '../../hooks/institutionHooks/useAddInstitutionMembers'; // Importar el hook

interface AddInstitutionMembersModalProps {
    institutionId: string;
    onClose?: () => void;
    onAddSuccess?: () => void;
}

const AddInstitutionMembersModal: React.FC<AddInstitutionMembersModalProps> = ({ institutionId, onClose, onAddSuccess }) => {
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const { mutate: addMembers, isLoading } = useAddInstitutionMembers();  // Utilizamos el hook para agregar miembros

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const addTag = useCallback(() => {
        if (inputValue.trim()) {
            const newTags = inputValue.split(/[\s,;]+/).filter(Boolean);
            const invalidEmails = newTags.filter(tag => !validateEmail(tag));
            if (invalidEmails.length > 0) {
                setError(`Invalid email(s): ${invalidEmails.join(', ')}`);
                return;
            }

            setTags([...tags, ...newTags]);
            setInputValue('');
            setError(null);
        }
    }, [inputValue, tags]);

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            e.preventDefault();
            const updatedTags = [...tags];
            updatedTags.pop();
            setTags(updatedTags);
        } else if ((e.key === ',' || e.key === 'Enter' || e.key === ';') && inputValue.trim()) {
            e.preventDefault();
            addTag();
        }
    };

    const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteText = e.clipboardData.getData('text');
        const newTags = pasteText.split(/[\s,;]+/).filter(Boolean);
        const invalidEmails = newTags.filter(tag => !validateEmail(tag));
        if (invalidEmails.length > 0) {
            setError(`Invalid email(s): ${invalidEmails.join(', ')}`);
            return;
        }

        setTags([...tags, ...newTags]);
        setInputValue('');
        setError(null);
    };

    const onRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const clearAllEmails = () => {
        setTags([]);
        setInputValue('');
        setError(null);
    };

    const handleAddMembers = () => {
        if (tags.length === 0) {
            setError('Email list cannot be empty.');
            return;
        }

        addMembers(
            { institutionId, emailList: tags, role: 'student' },  // Puedes ajustar el rol aquí
            {
                onSuccess: () => {
                    if (onAddSuccess) {
                        onAddSuccess();
                    }
                    if (onClose) {
                        onClose();
                    }
                },
                onError: (error) => {
                    setError('Error adding members. Please try again.');
                    console.error('Error adding members:', error);
                }
            }
        );
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [tags]);

    return (
        <ModalWrapper onClose={onClose}>
            <div className="relative p-6 w-full mt-2 rounded-lg shadow-md text-left border-2 transform transition-transform duration-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <h2 className="text-2xl font-bold mb-4 text-blue-900 dark:text-white text-center">Add Members to Institution</h2>

                <div className="flex justify-between mb-4">
                    <button
                        onClick={clearAllEmails}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none"
                    >
                        Clear All
                    </button>
                </div>

                <div className="mb-4">
                    <div
                        ref={containerRef}
                        className="border border-gray-300 bg-white rounded p-2 mb-4 w-full flex flex-wrap gap-2 relative dark:bg-gray-800 dark:border-gray-700 max-h-40 overflow-y-auto"
                    >
                        <div className="flex flex-wrap gap-1 w-full">
                            {tags.map((tag, index) => (
                                <div key={index} className="bg-blue-500 text-white rounded px-2 py-1 flex items-center gap-2">
                                    {tag}
                                    <button onClick={() => onRemoveTag(tag)} className="text-white hover:text-red-300">
                                        ×
                                    </button>
                                </div>
                            ))}
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={onKeyDown}
                                onPaste={onPaste}
                                placeholder="Enter email addresses"
                                className="flex-1 min-w-0 focus:outline-none bg-transparent text-gray-900 dark:text-gray-300"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm mt-2 max-h-16 overflow-y-auto">
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleAddMembers}
                        disabled={isLoading || tags.length === 0}
                        className={`inline-flex w-full justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-400 dark:bg-blue-800 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            isLoading || tags.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? 'Adding Members...' : 'Add Members'}
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default AddInstitutionMembersModal;