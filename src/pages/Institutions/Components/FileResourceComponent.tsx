import React, { useState, useEffect } from 'react';
import { FaMusic, FaFilm, FaImage, FaFileAlt, FaFileArchive, FaTrash, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import Container from '../../../components/ui/containers/Container';
import useUploadFile from "../../../hooks/newHooks/Resources/useUploadFile.ts";
import {NewResourceData} from "../CreateResourceModal.tsx";

interface FileResourceComponentProps {
    file: File;
    onDelete: () => void;
    onChange: (field: keyof NewResourceData, value: string | number | boolean) => void;}

const FileResourceComponent: React.FC<FileResourceComponentProps> = ({ file, onDelete, onChange }) => {
    const [name, setName] = useState<string>(file.name);
    const [description, setDescription] = useState<string>('');
    const [isConfirmedCancelled, setIsConfirmedCancelled] = useState<boolean>(false);

    
    const {
        uploadProgress,
        isUploading,
        cancelOrDelete,
        error,
        downloadURL
    } = useUploadFile(file);

    useEffect(() => {
        if (isConfirmedCancelled) {
            const timer = setTimeout(() => {
                onDelete();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isConfirmedCancelled, onDelete]);

    useEffect(() => {
        if (downloadURL) {
            onChange('url', downloadURL);
            onChange('readyForSave', true);
        }
    }, [downloadURL, onChange]);

    const handleCancel = () => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this upload?");
        if (confirmCancel) {
            cancelOrDelete();
            setIsConfirmedCancelled(true);
        }
    };

    const handleNameChange = (newName: string) => {
        setName(newName);
        onChange('title', newName); 
    };

    const handleDescriptionChange = (newDescription: string) => {
        setDescription(newDescription);
        onChange('description', newDescription); 
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

    if (isConfirmedCancelled) {
        return (
            <Container className="flex flex-col p-4 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md my-2">
                <p className="text-orange-500">{name} Cancelled</p>
            </Container>
        );
    }

    return (
        <Container className="flex flex-col p-4 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md my-2">
            <div className="flex items-center mb-2 relative">
                {getFileIcon(file.type)}
                <div className="flex-1 ml-4">
                    {/* Input para cambiar el nombre del archivo */}
                    <input
                        className="w-full p-1 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none text-lg font-semibold dark:text-white"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                    />
                    {/* Mostrar tamaño y extensión en un texto más pequeño */}
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {formatFileSize(file.size)} - {file.name.split('.').pop()?.toUpperCase() || 'Unknown'}
                    </p>
                </div>

                {/* Spinner o Check de carga y porcentaje */}
                <div className="flex items-center space-x-2">
                    {error ? (
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

                    {/* Botón para cancelar o eliminar */}
                    <button
                        onClick={handleCancel}
                        className="text-red-500 hover:text-red-700 ml-4"
                        title="Cancel Upload or Delete File"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>

            <textarea
                className="w-full p-2 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none text-sm dark:text-white resize-vertical"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                rows={1}
            />

            {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
        </Container>
    );
};

export default FileResourceComponent;