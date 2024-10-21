import React, { useState } from 'react';
import {
    FaFileAlt,
    FaMusic,
    FaFilm,
    FaLink,
    FaYoutube,
    FaImage,
    FaFileArchive,
    FaStickyNote,
    FaClock,
    FaUser,
    FaTags,
    FaDownload
} from 'react-icons/fa';
import DeleteButton from "../../../components/DeleteButton";
import { CollectionTypes } from "../../../data/CollectionTypes";
import RoundedTag from "../../../components/ui/text/RoundedTag.tsx";
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton";
import ModalWrapper from '../../../pages/ModalWrapper';

export interface ResourceData {
    _id: string;
    title: string;
    type: string;
    path: string;
    extension: string;
    size: string;
    url?: string;
    text?: string;
    tags: string[];
    creatorId: string;
    createdAt: string;
}

interface ResourceDataElementProps {
    resourceData: ResourceData;
    canDelete?: boolean;
}

const ResourceDataElement: React.FC<ResourceDataElementProps> = ({ resourceData, canDelete = false }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleClick = () => {
        // Si el recurso es un link, simplemente lo redirige
        if (resourceData.url && (resourceData.type === 'Link' || resourceData.type === 'YouTube Links')) {
            window.open(resourceData.url, '_blank');
        } else {
            // Para archivos como audio, video, imágenes, notas o project files, abre el modal
            openModal();
        }
    };

    // Asignar íconos y colores según el tipo de recurso
    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'Audio': return <FaMusic className="text-purple-500" />;
            case 'Video': return <FaFilm className="text-red-500" />;
            case 'Link': return <FaLink className="text-blue-500" />;
            case 'YouTube Links': return <FaYoutube className="text-red-600" />;
            case 'Images': return <FaImage className="text-green-500" />;
            case 'Documents': return <FaFileAlt className="text-orange-500" />;
            case 'Files (rar)': return <FaFileArchive className="text-yellow-500" />;
            case 'Notes/Text': return <FaStickyNote className="text-teal-500" />;
            default: return <FaFileAlt className="text-gray-500" />;
        }
    };

    return (
        <>
            <div onClick={handleClick} className="cursor-pointer">
                <div className="relative p-2 mb-0 rounded-lg shadow-sm text-left border-2 transition-all bg-white border-gray-200 hover:border-blue-300 dark:bg-gray-900 dark:border-gray-800 hover:dark:border-gray-700 w-full max-w-4xl flex items-center justify-between gap-1">

                    {/* Contenido a la izquierda */}
                    <div className="flex items-center gap-2">
                        {canDelete && (
                            <div className="absolute top-2 right-2">
                                <DeleteButton
                                    creatorId={resourceData.creatorId}
                                    elementId={resourceData._id}
                                    elementType={CollectionTypes.Resources}
                                    deleteRelations={false}
                                />
                            </div>
                        )}
                        <div>{getResourceIcon(resourceData.type)}</div>
                        <h2 className="text-md font-bold text-gray-600 dark:text-white">
                            {resourceData.title || 'Resource Title'}
                        </h2>
                    </div>

                    {/* Contenido a la derecha */}
                    <div className="flex items-center text-xs text-gray-400 dark:text-gray-700 gap-4">
                        <span className="flex items-center">
                            <FaUser className="mr-1" />
                            <span>{resourceData.creatorId || 'Unknown Creator'}</span>
                        </span>
                        <span className="flex items-center">
                            <FaClock className="mr-1" />
                            <span>{new Date(resourceData.createdAt).toLocaleDateString()}</span>
                        </span>

                        {/* Tags */}
                        {resourceData.tags && resourceData.tags.length > 0 && (
                            <div className="flex items-center gap-2">
                                <FaTags className="text-blue-300 dark:text-gray-700" />
                                <div className="flex flex-wrap gap-1">
                                    {resourceData.tags.map((tag, index) => (
                                        <RoundedTag key={index} textKey={tag} className="text-xs text-gray-500 dark:text-gray-400 bg-blue-100 dark:bg-gray-950" />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <ModalWrapper onClose={closeModal}>
                    <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">{resourceData.title}</h2>

                    {/* Renderizar el contenido basado en el tipo */}
                    {resourceData.type === 'Audio' && resourceData.url && (
                        <audio controls className="w-full mb-4">
                            <source src={resourceData.url} />
                            Your browser does not support the audio element.
                        </audio>
                    )}

                    {resourceData.type === 'Video' && resourceData.url && (
                        <video controls className="w-full mb-4">
                            <source src={resourceData.url} />
                            Your browser does not support the video tag.
                        </video>
                    )}

                    {resourceData.type === 'Images' && resourceData.url && (
                        <div className="flex flex-col items-center">
                            <img src={resourceData.url} alt={resourceData.title} className="mb-4 max-w-full h-auto" />
                        </div>
                    )}

                    {resourceData.type === 'Notes/Text' && resourceData.text && (
                        <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                            <p>{resourceData.text}</p>
                        </div>
                    )}

                    {/* Para archivos como Project Files (rar, zip), muestra detalles y botón de descarga */}
                    {(resourceData.type === 'Files (rar)' || resourceData.type === 'Documents') && (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <p><strong>File Name:</strong> {resourceData.title}</p>
                            <p><strong>Size:</strong> {resourceData.size}</p>
                        </div>
                    )}

                    {/* Botón de descarga para todos los tipos menos notas */}
                    {(resourceData.type !== 'Notes/Text') && (
                        <PrimaryButton
                            label="Download"
                            iconComponent={<FaDownload />}
                            className="mt-4"
                            onClick={() => window.open(resourceData.url, '_blank')}
                        />
                    )}
                </ModalWrapper>
            )}
        </>
    );
};

export default ResourceDataElement;