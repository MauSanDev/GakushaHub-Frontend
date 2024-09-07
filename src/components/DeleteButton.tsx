import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useDeleteElement } from '../hooks/useDeleteElement';
import { useNavigate } from 'react-router-dom';
import {useAuth} from "../context/AuthContext.tsx";

interface DeleteButtonProps {
    creatorId: string
    elementId: string;
    elementType: 'course' | 'lesson' | 'kanji' | 'word' | 'grammar' | 'generation' | 'kanjiDeck' | 'grammarDeck' | 'wordDeck';
    deleteRelations?: boolean;
    redirectTo?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ creatorId, elementId, elementType, deleteRelations = false, redirectTo }) => {
    const mutation = useDeleteElement();
    const navigate = useNavigate();
    const { user, userData } = useAuth();
    
    if (!user || (creatorId && userData?._id != creatorId)) return ;

    const handleDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();

        if (window.confirm(`Are you sure you want to delete this ${elementType}?`)) {
            mutation.mutate(
                { elementId, elementType, deleteRelations },
                {
                    onSuccess: () => {
                        if (redirectTo) {
                            navigate(redirectTo);
                        } else {
                            navigate(0);
                        }
                    },
                }
            );
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={mutation.isLoading}
            className="flex items-center gap-1 text-gray-700 bg-gray-300 dark:text-gray-300 dark:bg-gray-950 hover:text-white hover:bg-red-500 dark:hover:bg-red-500 px-2 py-2 rounded transition-colors duration-200 text-sm"
        >
            <FaTrash size={12} className="text-inherit transition-colors duration-75" />
        </button>
    );
};

export default DeleteButton;