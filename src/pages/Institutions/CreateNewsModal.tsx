import React, { useState } from 'react';
import ModalWrapper from '../ModalWrapper';
import Container from "../../components/ui/containers/Container.tsx";
import SectionTitle from "../../components/ui/text/SectionTitle.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import InputField from "../../components/ui/inputs/InputField";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importar los estilos por defecto de Quill
import TagSelector from "../../components/ui/containers/TagSelector.tsx";
import { FaPaperPlane } from "react-icons/fa";

interface CreateNewsModalProps {
    onClose: () => void;
    onCreateSuccess?: () => void;
}

const CreateNewsModal: React.FC<CreateNewsModalProps> = ({ onClose, onCreateSuccess }) => {
    const [newsTitle, setNewsTitle] = useState<string>('');
    const [content, setContent] = useState<string>(''); // Usamos este estado para el contenido del editor
    const [tags, setTags] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleCreateNews = () => {
        if (newsTitle.trim() === '') {
            setError("Title cannot be empty.");
            return;
        }

        // Simulación de creación de noticia
        setTimeout(() => {
            if (onCreateSuccess) {
                onCreateSuccess();
            }
            onClose();
        }, 1000);
    };

    return (
        <ModalWrapper onClose={onClose}>
            <Container className="w-full">
                <SectionTitle title={"Create a News Item"} className="text-center pb-4"/>

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
                    className={"w-full"}
                />

                {/* Quill Editor */}

                <div className="my-4 w-full">
                    <ReactQuill
                        value={content}
                        onChange={setContent}
                        className="custom-quill-editor" // Aplica tu propia clase para controlar el estilo
                    />
                </div>

                {/* Selector de etiquetas */}
                <TagSelector
                    selectedTags={tags}
                    onChange={setTags}
                    placeholder="Select Tags"
                    disabled={false}
                />

                <PrimaryButton
                    label="Create"
                    onClick={handleCreateNews}
                    iconComponent={<FaPaperPlane/>}
                    disabled={newsTitle.trim() === ''} // Añadir estado de isLoading si tienes
                    className="w-full mt-4"
                />
            </Container>
        </ModalWrapper>
    );
};

export default CreateNewsModal;