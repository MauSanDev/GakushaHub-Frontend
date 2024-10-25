import { useState, useEffect, useRef } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, UploadTask, deleteObject } from 'firebase/storage';

const useUploadFile = (file: File) => {
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [downloadURL, setDownloadURL] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const [isCancelled, setIsCancelled] = useState<boolean>(false);

    const uploadTaskRef = useRef<UploadTask | null>(null);
    const hasStarted = useRef<boolean>(false); // Nuevo ref para evitar doble inicio

    useEffect(() => {
        // Evitamos que se inicie la subida más de una vez
        if (hasStarted.current) return;

        const uploadFile = () => {
            setIsUploading(true);
            const storage = getStorage();
            const storageRef = ref(storage, `uploads/${file.name}`);
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
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        setDownloadURL(url);
                        setIsUploading(false);
                    } catch (err) {
                        setError("Failed to get download URL");
                        setIsUploading(false);
                    }
                }
            );
        };

        hasStarted.current = true; // Evitamos subir más de una vez
        uploadFile();

        return () => {
            if (uploadTaskRef.current && isUploading) {
                uploadTaskRef.current.cancel();
                setIsCancelled(true);
                setIsUploading(false);
            }
        };
    }, [file, isCancelled]);

    const cancelUpload = () => {
        if (uploadTaskRef.current && isUploading) {
            uploadTaskRef.current.cancel();
            setIsCancelled(true);
            setIsUploading(false);
        }
    };

    const deleteFile = async () => {
        if (downloadURL) {
            const storage = getStorage();
            const fileRef = ref(storage, `uploads/${file.name}`);
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

    const cancelOrDelete = () => {
        if (isUploading) {
            cancelUpload();
        } else if (downloadURL) {
            deleteFile();
        }
    };

    return {
        uploadProgress,
        downloadURL,
        error,
        isUploading,
        isDeleted,
        isCancelled,
        cancelUpload,
        deleteFile,
        cancelOrDelete
    };
};

export default useUploadFile;