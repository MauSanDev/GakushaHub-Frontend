import React, { useState, useEffect } from 'react';
import { FaMusic, FaFilm, FaImage, FaFileAlt, FaFileArchive, FaTrash, FaSpinner, FaCheck } from 'react-icons/fa';
import Container from '../../../components/ui/containers/Container';

interface FileResourceComponentProps {
    file: File;
    onDelete: () => void;
}

const FileResourceComponent: React.FC<FileResourceComponentProps> = ({ file, onDelete }) => {
    const [name, setName] = useState<string>(file.name);
    const [description, setDescription] = useState<string>('');
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    useEffect(() => {
        // Simulación de la barra de carga
        const interval = setInterval(() => {
            setUploadProgress(prev => (prev < 100 ? prev + 10 : 100));
        }, 300);

        return () => clearInterval(interval);
    }, []);

    // Determinar ícono basado en la extensión del archivo
    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith('audio')) return <FaMusic className="text-purple-500" />;
        if (fileType.startsWith('video')) return <FaFilm className="text-red-500" />;
        if (fileType.startsWith('image')) return <FaImage className="text-green-500" />;
        if (fileType.includes('zip') || fileType.includes('rar')) return <FaFileArchive className="text-yellow-500" />;
        return <FaFileAlt className="text-gray-500" />;
    };

    // Convertir tamaño de archivo a formato legible
    const formatFileSize = (size: number) => {
        if (size < 1024) return `${size} bytes`;
        if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
        return `${(size / 1048576).toFixed(2)} MB`;
    };

    return (
        <Container className="flex flex-col p-4 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md my-2">
            <div className="flex items-center mb-2 relative">
                {getFileIcon(file.type)}
                <div className="flex-1 ml-4">
                    {/* Input para cambiar el nombre del archivo */}
                    <input
                        className="w-full p-1 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none text-lg font-semibold dark:text-white"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {/* Mostrar tamaño y extensión en un texto más pequeño */}
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {formatFileSize(file.size)} - {file.name.split('.').pop()?.toUpperCase() || 'Unknown'}
                    </p>
                </div>

                {/* Spinner o Check de carga y porcentaje */}
                <div className="flex items-center space-x-2">
                    {uploadProgress < 100 ? (
                        <>
                            <FaSpinner className="animate-spin text-blue-500" />
                            <span className="text-sm text-blue-500">{uploadProgress}%</span>
                        </>
                    ) : (
                        <>
                            <FaCheck className="text-green-500" />
                            <span className="text-sm text-green-500">{uploadProgress}%</span>
                        </>
                    )}

                    <button
                        onClick={onDelete}
                        className="text-red-500 hover:text-red-700 ml-4"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>

            <textarea
                className="w-full p-2 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none text-sm dark:text-white resize-vertical"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={1}
            />
        </Container>
    );
};

export default FileResourceComponent;