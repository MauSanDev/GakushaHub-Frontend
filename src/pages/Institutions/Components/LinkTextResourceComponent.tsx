import React, { useState, useEffect } from 'react';
import { FaTrash, FaLink, FaYoutube, FaStickyNote, FaTimes } from 'react-icons/fa';
import Container from "../../../components/ui/containers/Container.tsx";

interface LinkTextResourceComponentProps {
    title: string;
    url?: string;
    text?: string;
    onDelete: () => void;
    onChange: (field: keyof LinkTextResourceData, value: string) => void;
}

export interface LinkTextResourceData {
    _id: string;
    title: string;
    url?: string;
    text?: string;
}

const LinkTextResourceComponent: React.FC<LinkTextResourceComponentProps> = ({
                                                                                 title,
                                                                                 url,
                                                                                 text,
                                                                                 onDelete,
                                                                                 onChange
                                                                             }) => {
    const [isValidUrl, setIsValidUrl] = useState(true);

    // Determina el icono basado en el tipo de enlace
    const getIcon = (url?: string) => {
        if (url?.includes('youtube.com') || url?.includes('youtu.be')) {
            return <FaYoutube className="text-red-600" />;
        } else if (url) {
            return <FaLink className="text-blue-500" />;
        } else {
            return <FaStickyNote className="text-teal-500" />;
        }
    };

    // Valida el formato de la URL
    useEffect(() => {
        if (url) {
            const urlPattern = new RegExp(
                '^(https?:\\/\\/)?' + // protocolo
                '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' + // dominio
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // IP (v4)
                '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' + // puerto y ruta
                '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-zA-Z\\d_]*)?$', 'i' // fragmento
            );
            setIsValidUrl(urlPattern.test(url));
        } else {
            setIsValidUrl(true); // Si no hay URL, lo consideramos válido
        }
    }, [url]);

    return (
        <Container className="relative p-4 mb-4 flex flex-col border border-gray-300 dark:border-gray-600 bg-transparent rounded-lg my-2">
            {/* Botón de eliminar */}
            <button
                onClick={onDelete}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
                <FaTimes />
            </button>

            {/* Icono e input de título */}
            <div className="flex items-center gap-2 mb-2">
                {getIcon(url)}
                <input
                    id="resourceTitle"
                    value={title}
                    onChange={(e) => onChange('title', e.target.value)}
                    placeholder="Title"
                    className="w-full p-1 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none text-lg font-semibold dark:text-white"
                />
            </div>

            {/* Input de URL */}
            <input
                id="resourceUrl"
                value={url || ''}
                onChange={(e) => onChange('url', e.target.value)}
                placeholder="URL"
                className={`w-full p-1 bg-transparent border-b focus:outline-none ${!isValidUrl ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} text-sm dark:text-white`}
            />
            {!isValidUrl && (
                <p className="text-red-500 text-xs mt-1">Invalid URL format</p>
            )}

            {/* TextArea opcional, una línea pero expandible */}
            <textarea
                id="resourceText"
                value={text || ''}
                onChange={(e) => onChange('text', e.target.value)}
                placeholder="Text (optional)"
                className="w-full p-1 bg-transparent border-b border-gray-200 dark:border-gray-200 focus:outline-none text-sm dark:text-white resize-vertical overflow-hidden"
                rows={1} // Comienza con una línea pero puede expandirse
                style={{ overflow: 'hidden' }}
            />
        </Container>
    );
};

export default LinkTextResourceComponent;