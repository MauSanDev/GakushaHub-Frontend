import { useState, useEffect, useRef } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, UploadTask, deleteObject } from 'firebase/storage';

interface UseUploadFileProps {
    path: string; // El path completo, ya con el ID y otros detalles necesarios
    onUploadFinished?: (url: string | null) => void;
}

const useUploadFile = ({ path, onUploadFinished }: UseUploadFileProps) => {
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const [isCancelled, setIsCancelled] = useState<boolean>(false);

    const uploadTaskRef = useRef<UploadTask | null>(null);
    const hasStarted = useRef<boolean>(false);

    // Método para iniciar la subida de archivos
    const uploadFile = (file: File) => {
        if (hasStarted.current) return;

        if (!file) {
            throw new Error("Trying to upload an empty file.");
        }

        setIsUploading(true);
        const storage = getStorage();
        const storageRef = ref(storage, path); // Usamos el path completo que se pasa al hook
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTaskRef.current = uploadTask;

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                if (isCancelled) return;
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                if (!isCancelled) {
                    setError(`Error uploading file: ${error.message}`);
                }
                setIsUploading(false);
            },
            async () => {
                if (isCancelled) return;
                try {
                    setIsUploading(false);
                    if (onUploadFinished) {
                        onUploadFinished(path); // Pasamos el path completo, ya que es el identificador
                    }
                } catch (err) {
                    setError("Failed to get download URL");
                    setIsUploading(false);
                    if (onUploadFinished) {
                        onUploadFinished(null);
                    }
                }
            }
        );

        hasStarted.current = true; // Aseguramos que no se suba más de una vez
    };

    useEffect(() => {
        return () => {
            if (uploadTaskRef.current && isUploading) {
                uploadTaskRef.current.cancel();
                setIsCancelled(true);
                setIsUploading(false);
            }
        };
    }, [isUploading]);

    const cancelUpload = () => {
        if (uploadTaskRef.current && isUploading) {
            uploadTaskRef.current.cancel();
            setIsCancelled(true);
            setIsUploading(false);
        }
    };

    const deleteFile = async () => {
        if (path) {
            const storage = getStorage();
            const fileRef = ref(storage, path); // Usamos el path completo
            try {
                await deleteObject(fileRef);
                setIsDeleted(true);
            } catch (error) {
                setError(`Error deleting file: ${error instanceof Error ? error.message : error}`);
            }
        } else {
            setError("No file URL to delete");
        }
    };

    const getTemporaryURL = async (): Promise<string | null> => {
        try {
            const storage = getStorage();
            const fileRef = ref(storage, path); // Usamos el path completo
            return await getDownloadURL(fileRef);
        } catch (err) {
            setError("Failed to get download URL");
            return null;
        }
    };

    const cancelOrDelete = () => {
        if (isUploading) {
            cancelUpload();
        } else {
            deleteFile();
        }
    };

    return {
        uploadProgress,
        error,
        isUploading,
        isDeleted,
        isCancelled,
        cancelUpload,
        deleteFile,
        cancelOrDelete,
        getTemporaryURL,
        uploadFile, // Método para iniciar la subida pasando el archivo
    };
};

export default useUploadFile;