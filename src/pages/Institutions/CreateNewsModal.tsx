import React, { useState } from 'react';
import ModalWrapper from '../ModalWrapper';
import Container from "../../components/ui/containers/Container.tsx";
import SectionTitle from "../../components/ui/text/SectionTitle.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import InputField from "../../components/ui/inputs/InputField";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TagSelector from "../../components/ui/containers/TagSelector.tsx";
import { FaPaperPlane } from "react-icons/fa";
import { useCreateNews } from "../../hooks/newHooks/News/useCreateNews";

interface CreateNewsModalProps {
    onClose: () => void;
    onCreateSuccess?: () => void;
}

const CreateNewsModal: React.FC<CreateNewsModalProps> = ({ onClose, onCreateSuccess }) => {
    const [newsTitle, setNewsTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const availableTags = ['News', 'Update', 'Important', 'Event', 'Announcement'];

    // Usamos el hook useCreateNews
    const { mutate: createNews, isLoading } = useCreateNews();

    const handleCreateNews = () => {
        // Validaciones para el título y el cuerpo del mensaje
        if (newsTitle.trim() === '' || content.trim() === '') {
            setError("Both the title and the content are required.");
            return;
        }

        createNews(
            {
                title: newsTitle,
                text: content,
                tags: tags,
            },
            {
                onSuccess: () => {
                    if (onCreateSuccess) {
                        onCreateSuccess();
                    }
                    onClose();
                },
                onError: (error) => {
                    console.error("Error creating news:", error);
                    setError("Failed to create news.");
                }
            }
        );
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
                        setError(null); // Limpiamos el error si se está editando
                    }}
                    placeholder="Title"
                    disabled={false}
                    error={error}
                    className={"w-full"}
                />

                <div className="my-4 w-full">
                    <ReactQuill
                        value={content}
                        onChange={(value) => {
                            setContent(value);
                            setError(null); // Limpiamos el error si se está editando
                        }}
                        className="custom-quill-editor"
                    />
                </div>

                <TagSelector
                    selectedTags={tags}
                    availableTags={availableTags}
                    onChange={setTags}
                    placeholder="Add Tags"
                    disabled={false}
                />

                {error && <p className="text-red-500">{error}</p>} {/* Mostramos el mensaje de error si existe */}

                <PrimaryButton
                    label="Create"
                    onClick={handleCreateNews}
                    iconComponent={<FaPaperPlane />}
                    disabled={isLoading || newsTitle.trim() === '' || content.trim() === ''} // Deshabilitamos si falta el título o el cuerpo
                    className="w-full mt-4"
                />
            </Container>
        </ModalWrapper>
    );
};

export default CreateNewsModal;