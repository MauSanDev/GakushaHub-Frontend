import React from 'react';
import ModalWrapper from '../ModalWrapper';
import Container from "../../components/ui/containers/Container.tsx";
import { FaClock, FaTags } from 'react-icons/fa';
import RoundedTag from "../../components/ui/text/RoundedTag.tsx";
import CreatorLabel from "../../components/ui/text/CreatorLabel.tsx";
import {NewsData} from "../../data/NewsData.ts";
import ModalTitle from "../../components/ui/text/ModalTitle.tsx";

interface NewsViewerModalProps {
    newsData: NewsData;
    onClose: () => void;
}

const NewsViewerModal: React.FC<NewsViewerModalProps> = ({ newsData, onClose }) => {
    return (
        <ModalWrapper onClose={onClose}>
            <Container className="w-full p-6 max-w-4xl">
                <ModalTitle title={newsData.title} className="text-center pb-4" />

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center">
                        <CreatorLabel creatorId={newsData.creatorId} />
                    </span>
                    <span className="flex items-center">
                        <FaClock className="mr-1" />
                        <span>{new Date(newsData.createdAt).toLocaleDateString()}</span>
                    </span>
                </div>

                {/* Contenido completo de la noticia tratado como HTML */}
                <div
                    className="mb-6 text-gray-800 dark:text-gray-200"
                    dangerouslySetInnerHTML={{ __html: newsData.text }} // Aquí tratamos el contenido como HTML
                />

                {/* Tags */}
                {newsData.tags && newsData.tags.length > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                        <FaTags className="text-gray-500 dark:text-gray-400" />
                        <div className="flex flex-wrap gap-2">
                            {newsData.tags.map((tag, index) => (
                                <RoundedTag key={index} textKey={tag} className="text-xs" />
                            ))}
                        </div>
                    </div>
                )}
            </Container>
        </ModalWrapper>
    );
};

export default NewsViewerModal;