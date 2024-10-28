import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useDeleteElement } from '../hooks/useDeleteElement';
import { useAuth } from "../context/AuthContext.tsx";
import TertiaryButton from "./ui/buttons/TertiaryButton.tsx";
import { CollectionTypes } from "../data/CollectionTypes.tsx";

interface DeleteButtonProps {
    creatorId: string;
    elementId: string;
    elementType: CollectionTypes;
    deleteRelations?: boolean;
    onDelete?: (elementId: string, collectionType: CollectionTypes) => void;
    extraParams?: Record<string, unknown>;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ creatorId, elementId, elementType, deleteRelations = false, onDelete, extraParams }) => {
    const mutation = useDeleteElement();
    const { user, userData } = useAuth();

    if (!user || (creatorId && userData?._id != creatorId)) return null;

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete this ${elementType}?`)) {
            mutation.mutate(
                {
                    elementIds: [elementId],
                    elementType,
                    deleteRelations,
                    extraParams
                },
                {
                    onSuccess: (deleted) => {
                        if (onDelete) {
                            onDelete(deleted[0], elementType);
                        }
                    },
                }
            );
        }
    };

    return (
        <TertiaryButton
            iconComponent={<FaTrash />}
            className="hover:bg-red-500 hover:dark:bg-red-500"
            onClick={handleDelete}
            disabled={mutation.isLoading}
        />
    );
};

export default DeleteButton;