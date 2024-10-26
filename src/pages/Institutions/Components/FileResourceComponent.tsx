import React, { useState, useEffect } from 'react';
import { FaTrash, FaSpinner, FaCheck, FaTimes, FaEdit, FaSave } from 'react-icons/fa';
import Container from '../../../components/ui/containers/Container';
import useUploadFile from "../../../hooks/newHooks/Resources/useUploadFile.ts";
import { useResources } from '../../../hooks/newHooks/useResources';
import { useUpdateData } from '../../../hooks/updateHooks/useUpdateData';
import { CollectionTypes } from "../../../data/CollectionTypes.tsx";
import { ResourceTypes } from "../../../data/Institutions/ResourceData.ts";
import { getResourceIcon } from "./ResourceDataElement.tsx";

export interface FileResourceData {
    _id?: string;
    title: string;
    description?: string;
    type: ResourceTypes;
    url?: string;
    tags?: string[];
}

interface FileResourceComponentProps {
    file: File;
    institutionId: string;
    onDelete: () => void;
}

const getFileType = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'unknown';

    const audioExtensions = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'];
    const videoExtensions = ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm'];
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'webp'];
    const compressedExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'odt', 'ods', 'pages', 'numbers', 'key', 'ibooks'];

    if (audioExtensions.includes(extension)) {
        return ResourceTypes.Audio;
    } else if (videoExtensions.includes(extension)) {
        return ResourceTypes.Video;
    } else if (imageExtensions.includes(extension)) {
        return ResourceTypes.Image;
    } else if (compressedExtensions.includes(extension)) {
        return ResourceTypes.Compressed;
    } else if (documentExtensions.includes(extension)) {
        return ResourceTypes.Document;
    } else {
        return ResourceTypes.File;
    }
};

const FileResourceComponent: React.FC<FileResourceComponentProps> = ({ file, institutionId, onDelete }) => {
    const { createResource } = useResources(institutionId, 1, 10);
    const { mutateAsync: updateResource } = useUpdateData<FileResourceData>();

    const [localResource, setLocalResource] = useState<FileResourceData>({
        title: file.name,
        description: "",
        type: getFileType(file),
        url: ``,
        tags: [],
    });
    const [isEditing, setIsEditing] = useState<boolean>(true);
    const [isCreated, setIsCreated] = useState<boolean>(false);
    const [isConfirmedCancelled, setIsConfirmedCancelled] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [resourcePath, setResourcePath] = useState<string>(`institutions/${institutionId}/resources/${file.name}`);

    const { uploadProgress, isUploading, cancelOrDelete, error: uploadError, uploadFile } = useUploadFile({
        path: `institutions/${institutionId}/resources/${file.name}`, // Path completo, incluyendo el nombre del archivo
        onUploadFinished: (fullPath) => {
            if (fullPath) {
                setResourcePath(fullPath);
                setLocalResource((prev) => ({ ...prev, url: fullPath }));
                handleSave()
            }
        }
    });

    // Iniciamos la subida de archivos solo cuando el componente se monta
    useEffect(() => {
        uploadFile(file); // Se llama al método de subida pasando el archivo
    }, [file, uploadFile]);


    useEffect(() => {
        if (isConfirmedCancelled) {
            const timer = setTimeout(() => {
                onDelete();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isConfirmedCancelled, onDelete]);

    const handleSave = async () => {
        if (!localResource?.title.trim()) {
            setError("Title cannot be empty");
            return;
        }

        if (isUploading) {
            setIsEditing(false);
            return;
        }

        try {
            if (!isCreated) {
                const createdResource = await createResource({
                    title: localResource.title,
                    description: localResource.description,
                    type: localResource.type,
                    url: localResource.url || resourcePath,
                    tags: localResource.tags,
                    institutionId,
                });
                setLocalResource((prev) => ({ ...prev, _id: createdResource._id }));
                setIsCreated(true);
            } else {
                await updateResource({
                    collection: CollectionTypes.Resources,
                    documentId: localResource._id as string,
                    newData: {
                        title: localResource.title,
                        description: localResource.description,
                        tags: localResource.tags,
                    }
                });
            }

            setIsEditing(false);
        } catch (err) {
            setError("Error saving resource");
            console.error(err);
        }
    };

    const handleCancel = () => {
        if (!localResource?.title.trim()) {
            setError("Title cannot be empty to cancel");
            return;
        }
        setIsEditing(false);
        setError(null);
    };

    const handleChange = (field: keyof FileResourceData, value: string) => {
        setLocalResource((prev) => ({ ...prev, [field]: value }));
    };

    const handleCancelUpload = () => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this upload?");
        if (confirmCancel) {
            cancelOrDelete();
            setIsConfirmedCancelled(true);
        }
    };

    const formatFileSize = (size: number) => {
        if (size < 1024) return `${size} bytes`;
        if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
        return `${(size / 1048576).toFixed(2)} MB`;
    };

    if (isConfirmedCancelled) {
        return (
            <Container className="flex flex-col p-4 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md my-2">
                <p className="text-orange-500">{localResource.title} Cancelled</p>
            </Container>
        );
    }

    return (
        <Container className="flex flex-col p-4 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md my-2">
            <div className="flex items-center mb-2 relative">
                {getResourceIcon(localResource.type)}
                <div className="flex-1 ml-4">
                    {isEditing ? (
                        <input
                            className="w-full p-1 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none text-lg font-semibold dark:text-white"
                            value={localResource.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    ) : (
                        <h2 className="text-md font-bold text-gray-600 dark:text-white">
                            {localResource.title || 'Untitled'}
                        </h2>
                    )}
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {formatFileSize(file.size)} - {file.name.split('.').pop()?.toUpperCase() || 'Unknown'}
                    </p>
                </div>

                <div className="flex items-center space-x-2">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} className="text-green-500 hover:text-green-700">
                                <FaSave />
                            </button>
                            <button onClick={handleCancel} className="text-red-500 hover:text-red-700">
                                <FaTimes />
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700">
                            <FaEdit />
                        </button>
                    )}
                    <button onClick={handleCancelUpload} className="text-red-500 hover:text-red-700 ml-4">
                        <FaTrash />
                    </button>
                </div>
            </div>

            {isEditing ? (
                <textarea
                    className="w-full p-2 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none text-sm dark:text-white resize-vertical"
                    placeholder="Description (optional)"
                    value={localResource.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={1}
                />
            ) : (
                localResource.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{localResource.description}</p>
                )
            )}

            <div className="flex items-end space-x-2 ml-auto mt-4">
                {uploadError ? (
                    <>
                        <FaTimes className="text-red-500" />
                        <span className="text-sm text-red-500">Error</span>
                    </>
                ) : isUploading ? (
                    <>
                        <FaSpinner className="animate-spin text-blue-500" />
                        <span className="text-sm text-blue-500">{uploadProgress.toFixed(0)}%</span>
                    </>
                ) : (
                    <>
                        <FaCheck className="text-green-500" />
                        <span className="text-sm text-green-500">Completed</span>
                    </>
                )}
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </Container>
    );
};

export default FileResourceComponent;