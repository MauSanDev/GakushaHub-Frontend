import React from 'react';
import ModalWrapper from '../ModalWrapper';
import Container from "../../components/ui/containers/Container.tsx";
import SectionTitle from "../../components/ui/text/SectionTitle.tsx";
import { FaClock, FaUser, FaTags } from 'react-icons/fa';
import RoundedTag from "../../components/ui/text/RoundedTag.tsx";
import { NewsData } from './Components/NewsDataElement'; // Importa la interfaz NewsData si está en el mismo archivo
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx"; // Por si quieres agregar botones de acción

interface NewsViewerModalProps {
    newsData: NewsData;
    onClose: () => void;
}

const NewsViewerModal: React.FC<NewsViewerModalProps> = ({ newsData, onClose }) => {
    return (
        <ModalWrapper onClose={onClose}>
            <Container className="w-full p-6 max-w-4xl">
                <SectionTitle title={newsData.title} className="text-center pb-4" />

                {/* Info sobre el creador y la fecha */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center">
                        <FaUser className="mr-1" />
                        <span>{newsData.creatorId || 'Unknown Creator'}</span>
                    </span>
                    <span className="flex items-center">
                        <FaClock className="mr-1" />
                        <span>{new Date(newsData.createdAt).toLocaleDateString()}</span>
                    </span>
                </div>

                {/* Contenido completo de la noticia */}
                <div className="mb-6 text-gray-800 dark:text-gray-200">
                    <p>{newsData.text}</p>
                </div>

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

                {/* Botón para cerrar */}
                <div className="text-center">
                    <PrimaryButton label="Close" onClick={onClose} className="w-full" />
                </div>
            </Container>
        </ModalWrapper>
    );
};

export default NewsViewerModal;