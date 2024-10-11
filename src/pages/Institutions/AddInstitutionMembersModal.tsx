import React, { useState, useCallback, useRef, useEffect } from 'react';
import ModalWrapper from '../ModalWrapper';
import { useAddInstitutionMembers } from '../../hooks/institutionHooks/useAddInstitutionMembers';
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import Container from "../../components/ui/containers/Container.tsx";
import SectionTitle from "../../components/ui/text/SectionTitle.tsx"; 

interface AddInstitutionMembersModalProps {
    institutionId: string;
    onClose: () => void;
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
            <Container className={"w-full"}>
                <SectionTitle title={"Add Members to Institution"} className="text-center pb-4" />
                
                <button
                    onClick={clearAllEmails}
                    className="mb-4 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none"
                >
                    Clear All
                </button>

                <div
                    ref={containerRef}
                    className="mb-4 border border-gray-300 bg-white rounded p-2 mb-4 w-full flex flex-wrap gap-2 relative dark:bg-gray-800 dark:border-gray-700 max-h-40 overflow-y-auto"
                >
                        {tags.map((tag, index) => (
                            <div key={index} className="bg-blue-500 text-white rounded px-2 py-1 flex items-center gap-2">
                                {tag}
                                <button onClick={() => onRemoveTag(tag)} className="text-white hover:text-blue-900">
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

                {error && (
                    <div className="text-red-500 text-sm mb-4 max-h-16 overflow-y-auto">
                        {error}
                    </div>
                )}
                
                <PrimaryButton
                    label="addMembers"
                    onClick={handleAddMembers}
                    disabled={isLoading || tags.length === 0}
                    className="w-full"
                />
            </Container>
        </ModalWrapper>
    );
};

export default AddInstitutionMembersModal;