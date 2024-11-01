import React, { useState } from 'react';
import ModalWrapper from '../ModalWrapper';
import { useCreateInstitution } from '../../hooks/institutionHooks/useCreateInstitution';
import Container from "../../components/ui/containers/Container.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import InputField from "../../components/ui/inputs/InputField";
import TextArea from "../../components/ui/inputs/TextArea";
import {useNavigate} from "react-router-dom";
import LocSpan from "../../components/LocSpan.tsx";
import ModalTitle from "../../components/ui/text/ModalTitle.tsx";

interface CreateInstitutionModalProps {
    onClose: () => void;
    onCreateSuccess?: () => void;
}

const CreateInstitutionModal: React.FC<CreateInstitutionModalProps> = ({ onClose, onCreateSuccess }) => {
    const [institutionName, setInstitutionName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const { mutate: createInstitution, isLoading } = useCreateInstitution();

    const handleCreateInstitution = () => {
        if (institutionName.trim() === '') {
            setError("Institution name cannot be empty.");
            return;
        }

        createInstitution(
            { name: institutionName, description },
            {
                onSuccess: (x) => {
                    setError(null);
                    navigate(`/institution/${x._id}/editProfile`)
                    if (onCreateSuccess) {
                        onCreateSuccess();
                    }
                    onClose();
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
                <ModalTitle title={"institution.myInstitution"} className="text-center pb-4" />

                <InputField
                    id="institutionName"
                    value={institutionName}
                    onChange={(e) => {
                        setInstitutionName(e.target.value);
                        setError(null);
                    }}
                    placeholder="institution.profileEdition.institutionName"
                    disabled={isLoading}
                    error={error}
                />

                <TextArea
                    id="institutionDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="addDescriptionPlaceholder"
                    disabled={isLoading}
                    error={error}
                    rows={4}
                />

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4"><LocSpan textKey={'institution.studyGroupKeys.changeLater'} /></p>

                <PrimaryButton
                    label="create"
                    onClick={handleCreateInstitution}
                    disabled={isLoading || institutionName.trim() === ''}
                    className={"w-full"}
                />
            </Container>
        </ModalWrapper>
    );
};

export default CreateInstitutionModal;