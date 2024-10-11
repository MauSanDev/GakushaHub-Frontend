import React, { useState } from 'react';
import ModalWrapper from '../ModalWrapper';
import { useCreateStudyGroup } from '../../hooks/institutionHooks/useCreateStudyGroup';
import Container from "../../components/ui/containers/Container.tsx";
import SectionTitle from "../../components/ui/text/SectionTitle.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import InputField from "../../components/ui/inputs/InputField";
import TextArea from "../../components/ui/inputs/TextArea";

interface CreateStudyGroupModalProps {
    institutionId: string;
    onClose: () => void;
    onCreateSuccess?: () => void;
}

const AddStudyGroupModal: React.FC<CreateStudyGroupModalProps> = ({ institutionId, onClose, onCreateSuccess }) => {
    const [groupName, setGroupName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const { mutate: createStudyGroup, isLoading } = useCreateStudyGroup();

    const handleCreateStudyGroup = () => {
        if (groupName.trim() === '') {
            setError("Study group name cannot be empty.");
            return;
        }

        createStudyGroup(
            { institutionId, groupName, description },
            {
                onSuccess: () => {
                    setError(null);
                    if (onCreateSuccess) {
                        onCreateSuccess();
                    }
                    if (onClose) {
                        onClose();
                    }
                },
                onError: (error: any) => {
                    setError(error.message || "Error creating study group.");
                },
            }
        );
    };

    return (
        <ModalWrapper onClose={onClose}>
            <Container className={"w-full"}>
                <SectionTitle title={"Create a New Study Group"} className="text-center pb-4" />

                <InputField
                    id="groupName"
                    value={groupName}
                    onChange={(e) => {
                        setGroupName(e.target.value);
                        setError(null); // Clear error when typing
                    }}
                    placeholder="Study group name"
                    disabled={isLoading}
                    error={error}
                />

                {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}

                <TextArea
                    id="groupDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    disabled={isLoading}
                    error={error}
                    rows={4}
                />

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">(You will be able to change these values later)</p>

                <PrimaryButton
                    label="create"
                    onClick={handleCreateStudyGroup}
                    disabled={isLoading || groupName.trim() === ''}
                    className="w-full"
                />
            </Container>
        </ModalWrapper>
    );
};

export default AddStudyGroupModal;