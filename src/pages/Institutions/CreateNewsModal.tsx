import React, {useEffect, useState} from 'react';
import ModalWrapper from '../ModalWrapper';
import Container from "../../components/ui/containers/Container.tsx";
import SectionTitle from "../../components/ui/text/SectionTitle.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import InputField from "../../components/ui/inputs/InputField";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TagSelector from "../../components/ui/containers/TagSelector.tsx";
import {FaPaperPlane} from "react-icons/fa";
import {useCreateNews} from "../../hooks/newHooks/News/useCreateNews";
import {useUpdateData} from "../../hooks/updateHooks/useUpdateData.ts";
import {NewsData} from "../../data/NewsData.ts";

interface CreateNewsModalProps {
    institutionId: string;
    onClose: () => void;
    onCreateSuccess?: () => void;
    newsData?: NewsData | null;
}

const CreateNewsModal: React.FC<CreateNewsModalProps> = ({onClose, onCreateSuccess, newsData, institutionId}) => {
    const [newsTitle, setNewsTitle] = useState<string>(newsData?.title || '');
    const [content, setContent] = useState<string>(newsData?.text || '');
    const [tags, setTags] = useState<string[]>(newsData?.tags || []);
    const [error, setError] = useState<string | null>(null);

    const availableTags = ['News', 'Update', 'Important', 'Event', 'Announcement'];

    const {mutate: createNews, isLoading: isCreating} = useCreateNews();
    const {mutate: updateNews, isLoading: isUpdating} = useUpdateData<NewsData>();

    useEffect(() => {

        if (newsData) {
            setNewsTitle(newsData.title);
            setContent(newsData.text);
            setTags(newsData.tags);
        }
    }, [newsData]);

    const handleSaveNews = () => {

        if (newsTitle.trim() === '' || content.trim() === '') {
            setError("Both the title and the content are required.");
            return;
        }

        if (newsData) {
            updateNews(
                {
                    collection: 'news',
                    documentId: newsData._id,
                    //@ts-expect-error we dont need all the parameters
                    newData: {
                        title: newsTitle,
                        text: content,
                        tags: tags,
                    },
                },
                {
                    onSuccess: () => {
                        if (onCreateSuccess) {
                            onCreateSuccess();
                        }
                        onClose();
                    },
                    onError: (error) => {
                        console.error("Error updating news:", error);
                        setError("Failed to update news.");
                    },
                }
            );
        } else {

            console.log(institutionId)
            createNews(
                {
                    institutionId,
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
                    },
                }
            );
        }
    };

    return (
        <ModalWrapper onClose={onClose}>
            <Container className="w-full">
                <SectionTitle
                    title={newsData ? "newsKeys.editNews" : "newsKeys.createNews"}
                    className="text-center pb-4"
                />

                <InputField
                    id="newsTitle"
                    value={newsTitle}
                    onChange={(e) => {
                        setNewsTitle(e.target.value);
                        setError(null);
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
                            setError(null);
                        }}
                        className="custom-quill-editor"
                    />
                </div>

                <TagSelector
                    selectedTags={tags}
                    availableTags={availableTags}
                    onChange={setTags}
                    placeholder="newsKeys.addTags"
                    disabled={false}
                />

                {error && <p className="text-red-500">{error}</p>} {/* Mostramos el mensaje de error si existe */}

                <PrimaryButton
                    label={newsData ? "update" : "create"}
                    onClick={handleSaveNews}
                    iconComponent={<FaPaperPlane/>}
                    disabled={
                        (newsData ? isUpdating : isCreating) ||
                        newsTitle.trim() === '' ||
                        content.trim() === ''
                    }
                    className="w-full mt-4"
                />
            </Container>
        </ModalWrapper>
    );
};

export default CreateNewsModal;