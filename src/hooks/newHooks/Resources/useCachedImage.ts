import { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import manabuMoriProfile from '../../../assets/bg-dark-mode.jpg';

interface UseCachedImageProps {
    path: string; 
    defaultImage?: string; 
}

export const useCachedImage = ({ path, defaultImage = manabuMoriProfile }: UseCachedImageProps) => {
    const [imageUrl, setImageUrl] = useState<string>(defaultImage);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const localStorageKey = `imageCache_${path}`;

    
    const loadImage = async () => {
        const cachedUrl = localStorage.getItem(localStorageKey);
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
            }
        );
    };

    
    useEffect(() => {
        loadImage();
    }, [path]);

    return { imageUrl, isUploading, uploadProgress, uploadImage, reloadImage };
};