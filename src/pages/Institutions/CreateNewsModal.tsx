import React, { useState } from 'react';
import ModalWrapper from '../ModalWrapper';
import Container from "../../components/ui/containers/Container.tsx";
import SectionTitle from "../../components/ui/text/SectionTitle.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import InputField from "../../components/ui/inputs/InputField";
import TextArea from "../../components/ui/inputs/TextArea";
import TagSelector from "../../components/ui/containers/TagSelector.tsx";
import { FaPaperPlane } from "react-icons/fa";

interface CreateNewsModalProps {
    onClose: () => void;
    onCreateSuccess?: () => void;
}

const CreateNewsModal: React.FC<CreateNewsModalProps> = ({ onClose, onCreateSuccess }) => {
    const [newsTitle, setNewsTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Simulación de creación de noticias
    const handleCreateNews = () => {
        if (newsTitle.trim() === '') {
            setError("Title cannot be empty.");
            return;
        }

        // Simulación de llamada a API para crear la noticia
        // Aquí puedes integrar tu hook de creación de noticias
        setTimeout(() => {
            if (onCreateSuccess) {
                onCreateSuccess();
            }
            onClose();
        }, 1000);
    };

    return (
        <ModalWrapper onClose={onClose}>
            <Container className="w-full flex flex-col space-y-4"> {/* Cambié flex-row por flex-col y añadí space-y-4 para espaciar los elementos */}
                <SectionTitle title={"Create a News Item"} className="text-center pb-4" />

                <InputField
                    id="newsTitle"
                    value={newsTitle}
                    onChange={(e) => {
                        setNewsTitle(e.target.value);
                        setError(null);
                    }}
                    placeholder="Title"
                    disabled={false} // Cambiar esto por isLoading si tienes un estado de carga
                    error={error}
                />

                <TextArea
                    id="newsDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    disabled={false} // Cambiar esto por isLoading si tienes un estado de carga
                    error={null}
                    rows={4}
                />

                {/* Selector de etiquetas */}
                <TagSelector
                    selectedTags={tags}
                    onChange={setTags}
                    placeholder="Select Tags"
                    disabled={false} // Cambiar esto por isLoading si tienes un estado de carga
                />

                <PrimaryButton
                    label="Create"
                    onClick={handleCreateNews}
                    iconComponent={<FaPaperPlane />}
                    disabled={newsTitle.trim() === ''} // Añadir estado de isLoading si tienes
                    className="w-full"
                />
            </Container>
        </ModalWrapper>
    );
};

export default CreateNewsModal;