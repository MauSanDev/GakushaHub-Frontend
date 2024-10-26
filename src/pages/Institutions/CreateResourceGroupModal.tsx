import React, { useState } from 'react';
import ModalWrapper from '../ModalWrapper';
import Container from "../../components/ui/containers/Container.tsx";
import SectionTitle from "../../components/ui/text/SectionTitle.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import InputField from "../../components/ui/inputs/InputField";
import TextArea from "../../components/ui/inputs/TextArea";
import {useResourceGroups} from "../../hooks/newHooks/Resources/useResourceGroups.ts";

interface CreateResourceGroupModalProps {
    onClose: () => void;
    onCreateSuccess?: () => void;
    institutionId: string;
}

const CreateResourceGroupModal: React.FC<CreateResourceGroupModalProps> = ({ onClose, onCreateSuccess, institutionId}) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { createResourceGroup, isLoading, resetQueries } = useResourceGroups(1, 20);

    const handleCreateResourceGroup = async () => {
        if (title.trim() === '') {
            setError("Title cannot be empty.");
            return;
        }

        try {
            await createResourceGroup(
                { name: title, description, elements: [], isPublic , institutionId}
            );
            resetQueries(); // Refresca la caché después de crear el grupo
            setError(null);
            if (onCreateSuccess) {
                onCreateSuccess();
            }
            onClose();
        } catch (error: any) {
            setError(error.message || "Error creating resource group.");
        }
    };

    return (
        <ModalWrapper onClose={onClose}>
            <Container className="w-full">
                <SectionTitle title="Create a New Resource Group" className="text-center pb-4" />

                <InputField
                    id="resourceGroupTitle"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        setError(null);
                    }}
                    placeholder="Resource Group title"
                    disabled={isLoading}
                    error={error}
                />

                <TextArea
                    id="resourceGroupDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description (optional)"
                    disabled={isLoading}
                    error={error}
                    rows={4}
                />

                <div className="flex items-center mt-4">
                    <input
                        id="isPublic"
                        type="checkbox"
                        checked={isPublic}
                        onChange={() => setIsPublic(!isPublic)}
                        disabled={isLoading}
                        className="mr-2"
                    />
                    <label htmlFor="isPublic" className="text-sm text-gray-700 dark:text-gray-300">
                        If public, all the Members of your Institution will be able to see this group
                    </label>
                </div>

                <PrimaryButton
                    label="Create"
                    onClick={handleCreateResourceGroup}
                    disabled={isLoading || title.trim() === ''}
                    className="w-full mt-6"
                />
            </Container>
        </ModalWrapper>
    );
};

export default CreateResourceGroupModal;