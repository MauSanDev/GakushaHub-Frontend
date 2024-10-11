import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useDeleteElement } from '../hooks/useDeleteElement';
import { useNavigate } from 'react-router-dom';
import {useAuth} from "../context/AuthContext.tsx";
import TertiaryButton from "./ui/buttons/TertiaryButton.tsx";

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

    const handleDelete = () => {

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
        
        <TertiaryButton iconComponent={<FaTrash />} className={"hover:bg-red-500 hover:dark:bg-red-500 "} onClick={handleDelete} disabled={mutation.isLoading}/>
    );
};

export default DeleteButton;