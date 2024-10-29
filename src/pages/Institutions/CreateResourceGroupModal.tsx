import React, { useState } from 'react';
import ModalWrapper from '../ModalWrapper';
import Container from "../../components/ui/containers/Container.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import InputField from "../../components/ui/inputs/InputField";
import TextArea from "../../components/ui/inputs/TextArea";
import {useResourceGroups} from "../../hooks/newHooks/Resources/useResourceGroups.ts";
import LocSpan from "../../components/LocSpan.tsx";
import ModalTitle from "../../components/ui/text/ModalTitle.tsx";

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

    const { createResourceGroup, isLoading, resetQueries } = useResourceGroups(1, 20, '', [], institutionId);

    const handleCreateResourceGroup = async () => {
        if (title.trim() === '') {
            setError("Title cannot be empty.");
            return;
        }

        try {
            await createResourceGroup(
                { name: title, description, elements: [], isPublic , institutionId}
            );
            resetQueries();
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
                <ModalTitle title="resourcesKeys.createNewGroup" className="text-center pb-4" />

                <InputField
                    id="resourceGroupTitle"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        setError(null);
                    }}
                    placeholder="title"
                    disabled={isLoading}
                    error={error}
                />

                <TextArea
                    id="resourceGroupDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="addDescriptionPlaceholder"
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
                        <LocSpan textKey={"resourcesKeys.publicToggle"} />
                    </label>
                </div>

                <PrimaryButton
                    label="resourcesKeys.createGroup"
                    onClick={handleCreateResourceGroup}
                    disabled={isLoading || title.trim() === ''}
                    className="w-full mt-6"
                />
            </Container>
        </ModalWrapper>
    );
};

export default CreateResourceGroupModal;