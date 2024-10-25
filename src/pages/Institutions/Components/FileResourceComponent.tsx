import React, { useState, useEffect } from 'react';
import { FaMusic, FaFilm, FaImage, FaFileAlt, FaFileArchive, FaTrash, FaSpinner, FaCheck, FaTimes, FaEdit, FaSave } from 'react-icons/fa';
import Container from '../../../components/ui/containers/Container';
import useUploadFile from "../../../hooks/newHooks/Resources/useUploadFile.ts";

export interface FileResourceData {
    title: string;
    description?: string;
    type: string;
    url?: string;
    tags?: string[];
}

const useFetchResourceData = (instanceId: string, file: File): FileResourceData | null => {
    const [resource, setResource] = useState<FileResourceData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const fakeData: FileResourceData = {
                title: file.name,
                description: "Sample description for file",
                type: "File",
                url: "",
                tags: [],
            };
            setResource(fakeData);
        };

        fetchData();
    }, [instanceId]);

    return resource;
};

interface FileResourceComponentProps {
    instanceId: string;
    file: File;
    onDelete: () => void;
}

const FileResourceComponent: React.FC<FileResourceComponentProps> = ({ instanceId, file, onDelete }) => {
    const resource = useFetchResourceData(instanceId, file);
    const [localResource, setLocalResource] = useState<FileResourceData | null>(resource);
    const [isEditing, setIsEditing] = useState<boolean>(true); // Inicia en modo edición
    const [isConfirmedCancelled, setIsConfirmedCancelled] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { uploadProgress, isUploading, cancelOrDelete, error: uploadError, downloadURL } = useUploadFile(file);

    useEffect(() => {
        if (resource) {
            setLocalResource(resource);
        }
    }, [resource]);

    useEffect(() => {
        if (isConfirmedCancelled) {
            const timer = setTimeout(() => {
                onDelete();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isConfirmedCancelled, onDelete]);

    useEffect(() => {
        if (downloadURL && localResource) {
            setLocalResource((prev) => prev ? { ...prev, url: downloadURL } : null);
        }
    }, [downloadURL, localResource]);

    const handleSave = () => {
        if (!localResource?.title.trim()) {
            setError("Title cannot be empty");
            return;
        }
        setError(null);

        console.log("Recurso guardado:", localResource);

        setIsEditing(false);
    };

    const handleCancel = () => {
        if (!localResource?.title.trim()) {
            setError("Title cannot be empty to cancel");
            return;
        }
        setLocalResource(resource); // Revertimos los cambios al original
        setIsEditing(false);
        setError(null);
    };

    const handleChange = (field: keyof FileResourceData, value: string) => {
        if (localResource) {
            setLocalResource((prev) => prev ? { ...prev, [field]: value } : null);
        }
    };

    const handleCancelUpload = () => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this upload?");
        if (confirmCancel) {
            cancelOrDelete();
            setIsConfirmedCancelled(true);
        }
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith('audio')) return <FaMusic className="text-purple-500" />;
        if (fileType.startsWith('video')) return <FaFilm className="text-red-500" />;
        if (fileType.startsWith('image')) return <FaImage className="text-green-500" />;
        if (fileType.includes('zip') || fileType.includes('rar')) return <FaFileArchive className="text-yellow-500" />;
        return <FaFileAlt className="text-gray-500" />;
    };

    const formatFileSize = (size: number) => {
        if (size < 1024) return `${size} bytes`;
        if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
        return `${(size / 1048576).toFixed(2)} MB`;
    };

    if (!localResource) {
        return <div>Loading...</div>;
    }

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
                {getFileIcon(file.type)}
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
                                <FaSave/>
                            </button>
                            <button onClick={handleCancel} className="text-red-500 hover:text-red-700">
                                <FaTimes/>
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700">
                            <FaEdit/>
                        </button>
                    )}
                    <button onClick={handleCancelUpload} className="text-red-500 hover:text-red-700 ml-4">
                        <FaTrash/>
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
                        <FaTimes className="text-red-500"/>
                        <span className="text-sm text-red-500">Error</span>
                    </>
                ) : isUploading ? (
                    <>
                        <FaSpinner className="animate-spin text-blue-500"/>
                        <span className="text-sm text-blue-500">{uploadProgress.toFixed(0)}%</span>
                    </>
                ) : (
                    <>
                        <FaCheck className="text-green-500"/>
                        <span className="text-sm text-green-500">Completed</span>
                    </>
                )}
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </Container>
    );
};

export default FileResourceComponent;