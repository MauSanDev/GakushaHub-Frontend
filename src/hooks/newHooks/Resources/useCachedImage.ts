import { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import manabuMoriProfile from '../../../assets/bg-dark-mode.jpg';

interface UseCachedImageProps {
    path: string;
    defaultImage?: string;
}

const CACHE_EXPIRATION_MS = 60 * 60 * 1000; // 1 hora en milisegundos

export const useCachedImage = ({ path, defaultImage = manabuMoriProfile }: UseCachedImageProps) => {
    const [imageUrl, setImageUrl] = useState<string>(defaultImage);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const localStorageKey = `imageCache_${path}`;
    const notFoundKey = `${localStorageKey}_notFound`;

    const isFirebaseBlocked = false;

    const loadImage = async () => {

        if (isFirebaseBlocked) {
            console.warn("Firebase access is temporarily blocked. Loading default image.");
            setImageUrl(defaultImage);
            return;
        }
        
        const cachedUrl = localStorage.getItem(localStorageKey);
        const notFoundCache = localStorage.getItem(notFoundKey);
        const currentTime = Date.now();

        // Si la imagen no existe y el TTL no ha expirado, usa la default y no hace request
        if (notFoundCache) {
            const { timestamp } = JSON.parse(notFoundCache);
            if (currentTime - timestamp < CACHE_EXPIRATION_MS) {
                setImageUrl(defaultImage);
                return;
            } else {
                // El TTL expiró, limpia la cache de "no encontrada"
                localStorage.removeItem(notFoundKey);
            }
        }

        if (cachedUrl) {
            setImageUrl(cachedUrl);
        } else {
            await reloadImage();
        }
    };

    const reloadImage = async () => {
        try {
            const storage = getStorage();
            const imageRef = ref(storage, path);
            const url = await getDownloadURL(imageRef);
            setImageUrl(url);
            localStorage.setItem(localStorageKey, url);
        } catch (error) {
            console.error("Error fetching image from Firebase:", error);
            setImageUrl(defaultImage);

            // Guarda el estado "no encontrada" en el cache con el timestamp actual
            const notFoundData = JSON.stringify({ timestamp: Date.now() });
            localStorage.setItem(notFoundKey, notFoundData);
        }
    };

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
                localStorage.setItem(localStorageKey, url);
                localStorage.removeItem(notFoundKey); // Elimina el estado de "no encontrado" si la imagen se carga
            }
        );
    };

    useEffect(() => {
        loadImage();
    }, [path]);

    return { imageUrl, isUploading, uploadProgress, uploadImage, reloadImage };
};