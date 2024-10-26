import React, { useState } from 'react';
import { FaFileAlt,  FaMusic,  FaFilm,  FaLink,  FaYoutube,  FaImage,  FaFileArchive,  FaStickyNote,  FaClock,  FaUser,  FaTags,  FaDownload} from 'react-icons/fa';
import DeleteButton from "../../../components/DeleteButton";
import { CollectionTypes } from "../../../data/CollectionTypes";
import RoundedTag from "../../../components/ui/text/RoundedTag.tsx";
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton";
import ModalWrapper from '../../../pages/ModalWrapper';
import {ResourceData, ResourceTypes} from "../../../data/Institutions/ResourceData.ts";

interface ResourceDataElementProps {
    resourceData: ResourceData;
    canDelete?: boolean;
}
export const getResourceIcon = (type: ResourceTypes) => {
    
    console.log(type)
    switch (type) {
        case ResourceTypes.Audio: return <FaMusic className="text-purple-500" />;
        case ResourceTypes.Video: return <FaFilm className="text-red-500" />;
        case ResourceTypes.Link: return <FaLink className="text-blue-500" />;
        case ResourceTypes.YouTube: return <FaYoutube className="text-red-600" />;
        case ResourceTypes.Image: return <FaImage className="text-green-500" />;
        case ResourceTypes.Document: return <FaFileAlt className="text-orange-500" />;
        case ResourceTypes.Compressed: return <FaFileArchive className="text-yellow-500" />;
        case ResourceTypes.NoteText: return <FaStickyNote className="text-teal-500" />;
        default: return <FaFileAlt className="text-gray-500" />;
    }
};

const ResourceDataElement: React.FC<ResourceDataElementProps> = ({ resourceData, canDelete = false }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleClick = () => {
        if (resourceData.url && (resourceData.type === ResourceTypes.Link || resourceData.type === ResourceTypes.YouTube)) {
            window.open(resourceData.url, '_blank');
        } else {
            openModal();
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
                    {resourceData.type === ResourceTypes.Audio && resourceData.url && (
                        <audio controls className="w-full mb-4">
                            <source src={resourceData.url} />
                            Your browser does not support the audio element.
                        </audio>
                    )}

                    {resourceData.type === ResourceTypes.Video && resourceData.url && (
                        <video controls className="w-full mb-4">
                            <source src={resourceData.url} />
                            Your browser does not support the video tag.
                        </video>
                    )}

                    {resourceData.type === ResourceTypes.Image && resourceData.url && (
                        <div className="flex flex-col items-center">
                            <img src={resourceData.url} alt={resourceData.title} className="mb-4 max-w-full h-auto" />
                        </div>
                    )}

                    {resourceData.type === ResourceTypes.NoteText && resourceData.description && (
                        <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                            <p>{resourceData.description}</p>
                        </div>
                    )}

                    {(resourceData.type === ResourceTypes.Compressed || resourceData.type === ResourceTypes.Document) && (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <p><strong>File Name:</strong> {resourceData.title}</p>
                            <p><strong>Size:</strong> {resourceData.size}</p>
                        </div>
                    )}

                    {(resourceData.type !== ResourceTypes.NoteText) && (
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