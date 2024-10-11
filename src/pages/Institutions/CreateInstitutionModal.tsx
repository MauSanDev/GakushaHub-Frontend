import React, { useState } from 'react';
import ModalWrapper from '../ModalWrapper';
import { useCreateInstitution } from '../../hooks/institutionHooks/useCreateInstitution';
import Container from "../../components/ui/containers/Container.tsx";
import SectionTitle from "../../components/ui/text/SectionTitle.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import InputField from "../../components/ui/inputs/InputField";
import TextArea from "../../components/ui/inputs/TextArea";

interface CreateInstitutionModalProps {
    onClose: () => void;
    onCreateSuccess?: () => void;
}

const CreateInstitutionModal: React.FC<CreateInstitutionModalProps> = ({ onClose, onCreateSuccess }) => {
    const [institutionName, setInstitutionName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const { mutate: createInstitution, isLoading } = useCreateInstitution();

    const handleCreateInstitution = () => {
        if (institutionName.trim() === '') {
            setError("Institution name cannot be empty.");
            return;
        }

        createInstitution(
            { name: institutionName, description },
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
                    setError(error.message || "Error creating institution.");
                },
            }
        );
    };

    return (
        <ModalWrapper onClose={onClose}>
            <Container className={"w-full"}>
                <SectionTitle title={"Create a New Institution"} className="text-center pb-4" />

                <InputField
                    id="institutionName"
                    value={institutionName}
                    onChange={(e) => {
                        setInstitutionName(e.target.value);
                        setError(null); // Clear error when typing
                    }}
                    placeholder="Institution name"
                    disabled={isLoading}
                    error={error}
                />

                <TextArea
                    id="institutionDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    disabled={isLoading}
                    error={error}
                    rows={4}
                />

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">(You will be able to change this values later)</p>

                <PrimaryButton label="create" onClick={handleCreateInstitution} disabled={isLoading || institutionName.trim() === ''} className={"w-full"} />
            </Container>
        </ModalWrapper>
    );
};

export default CreateInstitutionModal;