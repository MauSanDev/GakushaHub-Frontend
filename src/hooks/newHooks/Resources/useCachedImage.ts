import { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

interface UseCachedImageProps {
    path: string; // Path de Firebase Storage para la imagen
    defaultImage: string; // URL de imagen por defecto
}

export const useCachedImage = ({ path, defaultImage }: UseCachedImageProps) => {
    const [imageUrl, setImageUrl] = useState<string>(defaultImage);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const localStorageKey = `imageCache_${path}`;

    // Carga de imagen desde localStorage o Firebase
    const loadImage = async () => {
        const cachedUrl = localStorage.getItem(localStorageKey);
        if (cachedUrl) {
            setImageUrl(cachedUrl);
        } else {
            try {
                const storage = getStorage();
                const imageRef = ref(storage, path);
                const url = await getDownloadURL(imageRef);
                setImageUrl(url);
                localStorage.setItem(localStorageKey, url); // Guarda en cache
            } catch (error) {
                console.error("Error fetching image from Firebase:", error);
                setImageUrl(defaultImage); // Usa la imagen por defecto en caso de error
            }
        }
    };

    // Subir una nueva imagen a Firebase y actualizar la caché
    const uploadImage = (file: File) => {
        setIsUploading(true);
        const storage = getStorage();
        const imageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(imageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Error uploading file:", error);
                setIsUploading(false);
            },
            async () => {
                setIsUploading(false);
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                setImageUrl(url);
                localStorage.setItem(localStorageKey, url); // Actualiza la cache
            }
        );
    };

    // Cargar la imagen en el montaje
    useEffect(() => {
        loadImage();
    }, [path]);

    return { imageUrl, isUploading, uploadProgress, uploadImage, loadImage };
};