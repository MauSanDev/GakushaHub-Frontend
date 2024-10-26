import React, {useEffect, useState} from 'react';
import {FaClock, FaDownload, FaEdit, FaFileAlt, FaFileArchive, FaFilm, FaFolderOpen, FaImage, FaLink, FaMusic, FaSave, FaStickyNote, FaTags, FaTimes, FaTrash, FaYoutube} from 'react-icons/fa';
import {CollectionTypes} from "../../../data/CollectionTypes";
import RoundedTag from "../../../components/ui/text/RoundedTag.tsx";
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton";
import ModalWrapper from '../../../pages/ModalWrapper';
import {ResourceData, ResourceTypes} from "../../../data/Institutions/ResourceData.ts";
import useUploadFile from "../../../hooks/newHooks/Resources/useUploadFile.ts";
import {useUpdateData} from '../../../hooks/updateHooks/useUpdateData';
import TertiaryButton from "../../../components/ui/buttons/TertiaryButton.tsx";
import {useDeleteElement} from "../../../hooks/useDeleteElement.ts";

interface ResourceDataElementProps {
    resourceData: ResourceData;
    canDelete?: boolean;
    onDelete: () => void;
}

export const getResourceIcon = (type: ResourceTypes, url: string = "") => {
    switch (type) {
        case ResourceTypes.Audio: return <FaMusic className="text-purple-500" />;
        case ResourceTypes.Video: return <FaFilm className="text-red-500" />;
        case ResourceTypes.Image: return <FaImage className="text-green-500" />;
        case ResourceTypes.Document: return <FaFileAlt className="text-orange-500" />;
        case ResourceTypes.Compressed: return <FaFileArchive className="text-yellow-500" />;
        case ResourceTypes.LinkText: {
            if (url)
            {
                if (url.includes('youtube'))
                {
                    return <FaYoutube className="text-red-600" />
                }
                return <FaLink className="text-blue-500" />
            }
            return <FaStickyNote className="text-teal-500"/>;
        }
        default: return <FaFileAlt className="text-gray-500" />;
    }
};

const ResourceDataElement: React.FC<ResourceDataElementProps> = ({ resourceData, canDelete = false, onDelete}) => {
    const { mutateAsync: updateResource } = useUpdateData<ResourceData>();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resourceUrl, setResourceUrl] = useState<string | null>(null);
    const [loadingUrl, setLoadingUrl] = useState(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [localResource, setLocalResource] = useState<ResourceData>(resourceData);
    const [isValidUrl, setIsValidUrl] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { mutate: deleteResource} = useDeleteElement();


    const { getTemporaryURL, error: uploadError, deleteFile } = useUploadFile({
        path: resourceData.url || ''
    });

    useEffect(() => {
        if (isModalOpen && resourceData.url) {
            fetchResourceUrl();
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (localResource?.url) {
            const urlPattern = new RegExp(
                '^(https?:\\/\\/)?' +
                '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' +
                '((\\d{1,3}\\.){3}\\d{1,3}))' +
                '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' +
                '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' +
                '(\\#[-a-zA-Z\\d_]*)?$', 'i'
            );
            setIsValidUrl(urlPattern.test(localResource.url));
        } else {
            setIsValidUrl(true);
        }
    }, [localResource?.url]);

    const fetchResourceUrl = async () => {
        setLoadingUrl(true);
        try {
            const tempUrl = await getTemporaryURL();
            setResourceUrl(tempUrl);
        } catch (err) {
            console.error('Error fetching resource URL:', err);
        }
        setLoadingUrl(false);
    };

    const handleSave = async () => {
        if (!localResource?.title.trim()) {
            setError("Title cannot be empty");
            return;
        }
        if (localResource.type === ResourceTypes.LinkText && !isValidUrl) {
            setError("Url format is invalid");
            return;
        }
        setError(null);

        try {
            await updateResource({
                collection: CollectionTypes.Resources,
                documentId: localResource._id,
                newData: {
                    title: localResource.title,
                    description: localResource.description,
                    url: localResource.url,
                    tags: localResource.tags,
                }
            });
            setIsEditing(false);
        } catch (err) {
            setError("Error saving resource");
            console.error(err);
        }
    };

    const handleCancel = () => {
        setLocalResource(resourceData);
        setIsEditing(false);
        setError(null);
    };

    const handleChange = (field: keyof ResourceData, value: string) => {
        setLocalResource((prev) => ({ ...prev, [field]: value }));
    };

    const openModal = () => {
        
        if (resourceData.type === ResourceTypes.LinkText)
        {
            return;
        }
        
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this resource?");

        if (resourceData.type !== ResourceTypes.LinkText)
        {
            await deleteFile();
        }
        
        deleteResource(
            {
                elementIds: [resourceData._id],
                elementType: CollectionTypes.Resources,
                deleteRelations: true,
            },
            {
                onSuccess: () => {
                    if (onDelete)
                    {
                        onDelete();
                    }
                },
                onError: (error) => {
                    console.error('Error deleting member:', error);
                },
            }
        );
        
        if (confirmDelete) {
            console.log('Resource deleted:', resourceData._id);
        }
    };

    return (
        <>
            <div>
                <div className="relative p-2 mb-0 rounded-lg shadow-sm text-left border-2 transition-all bg-white border-gray-200 hover:border-blue-300 dark:bg-gray-900 dark:border-gray-800 hover:dark:border-gray-700 w-full max-w-4xl flex justify-between gap-1">

                    <div className="flex items-center gap-2">
                        <div>{getResourceIcon(localResource.type, localResource.url)}</div>
                        <div className="flex flex-col">
                            {isEditing ? (
                                <>
                                    <input
                                        value={localResource.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        placeholder="Title"
                                        className="w-full p-1 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none text-lg font-semibold dark:text-white"
                                    />

                                    {localResource.type === ResourceTypes.LinkText && (
                                        <input
                                            value={localResource.url || ''}
                                            onChange={(e) => handleChange('url', e.target.value)}
                                            placeholder="URL"
                                            className={`w-full p-1 bg-transparent border-b focus:outline-none ${!isValidUrl ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} text-sm dark:text-white`}
                                        />
                                    )}
                                    
                                    <textarea
                                        value={localResource.description || ''}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        placeholder="Description"
                                        className="w-full p-1 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none text-sm dark:text-white resize-vertical"
                                        rows={2}
                                    />
                                </>
                            ) : (
                                <>
                                    <h2 className="text-md font-bold text-gray-600 dark:text-white">
                                        {localResource.title || 'Untitled'}
                                    </h2>
                                    
                                    {localResource.type === ResourceTypes.LinkText && localResource.url && (
                                        <a href={localResource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs underline">
                                            {localResource.url}
                                        </a>
                                    )}
                                    
                                    {localResource.description && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {localResource.description}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 gap-4 ml-auto">
                        <span className="flex items-center">
                            <FaClock className="mr-1" />
                            <span>{new Date(resourceData.createdAt).toLocaleDateString()}</span>
                        </span>
                        {localResource.tags && localResource.tags.length > 0 && (
                            <div className="flex items-center gap-2">
                                <FaTags className="text-blue-300 dark:text-gray-700" />
                                <div className="flex flex-wrap gap-1">
                                    {localResource.tags.map((tag, index) => (
                                        <RoundedTag key={index} textKey={tag} className="text-xs text-gray-500 dark:text-gray-400 bg-blue-100 dark:bg-gray-950" />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex items-center space-x-0.5">
                            {isEditing ? (
                                <>
                                    <TertiaryButton iconComponent={<FaSave />} onClick={handleSave} className="hover:text-green-500"/>
                                    <TertiaryButton iconComponent={<FaTimes />} onClick={handleCancel} className="hover:text-red-500"/>

                                </>
                            ) : (
                                <>
                                    <TertiaryButton iconComponent={<FaEdit />} onClick={() => setIsEditing(true)} />
                                    {canDelete && (
                                            <TertiaryButton iconComponent={<FaTrash />} onClick={handleDelete} className="hover:text-red-500"/>
                                        )}
                                    <TertiaryButton iconComponent={<FaFolderOpen />} label={"Open"} onClick={openModal} />
                                </>
                        )}

                            
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <ModalWrapper onClose={closeModal}>
                    <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">{localResource.title}</h2>

                    {resourceData.type === ResourceTypes.Audio && resourceUrl && (
                        <audio controls className="w-full mb-4">
                            <source src={resourceUrl} />
                            Your browser does not support the audio element.
                        </audio>
                    )}

                    {resourceData.type === ResourceTypes.Video && resourceUrl && (
                        <video controls className="w-full mb-4">
                            <source src={resourceUrl} />
                            Your browser does not support the video tag.
                        </video>
                    )}

                    {resourceData.type === ResourceTypes.Image && resourceUrl && (
                        <div className="flex flex-col items-center">
                            <img src={resourceUrl} alt={localResource.title} className="mb-4 max-w-full h-auto" />
                        </div>
                    )}

                    {resourceData.type === ResourceTypes.LinkText && localResource.description && (
                        <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                            <p>{localResource.description}</p>
                        </div>
                    )}

                    {(resourceData.type === ResourceTypes.Compressed || resourceData.type === ResourceTypes.Document) && (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <p><strong>File Name:</strong> {localResource.title}</p>
                            <p><strong>Size:</strong> {resourceData.size}</p>
                        </div>
                    )}

                    {(resourceData.type !== ResourceTypes.LinkText && resourceUrl) && (
                        <PrimaryButton
                            label="Download"
                            iconComponent={<FaDownload />}
                            className="mt-4"
                            onClick={() => window.open(resourceUrl, '_blank')}
                        />
                    )}

                    {loadingUrl && <p>Loading resource...</p>}
                    {uploadError && <p>Error fetching URL: {uploadError}</p>}
                    {error && <p>Error fetching URL: {error}</p>}
                </ModalWrapper>
            )}
        </>
    );
};

export default ResourceDataElement;