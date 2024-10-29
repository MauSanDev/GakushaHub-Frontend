import { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import manabuMoriProfile from '../../../assets/bg-dark-mode.jpg';

interface UseCachedImageProps {
    path: string;
    defaultImage?: string;
}

const CACHE_EXPIRATION_MS = 60 * 60 * 1000;
const MAX_WIDTH = 1500;
const MAX_HEIGHT = 1500;

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

        if (notFoundCache) {
            const { timestamp } = JSON.parse(notFoundCache);
            if (currentTime - timestamp < CACHE_EXPIRATION_MS) {
                setImageUrl(defaultImage);
                return;
            } else {
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

            const notFoundData = JSON.stringify({ timestamp: Date.now() });
            localStorage.setItem(notFoundKey, notFoundData);
        }
    };

    const resizeImage = (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.src = e.target?.result as string;
            };

            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                    if (width > height) {
                        height = (MAX_WIDTH / width) * height;
                        width = MAX_WIDTH;
                    } else {
                        width = (MAX_HEIGHT / height) * width;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error("Image resizing failed"));
                            }
                        },
                        "image/jpeg",
                        0.8 // Calidad de compresión JPG (0 a 1)
                    );
                }
            };

            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const uploadImage = async (file: File) => {
        setIsUploading(true);
        try {
            const resizedImage = await resizeImage(file);
            const storage = getStorage();
            const imageRef = ref(storage, path);
            const uploadTask = uploadBytesResumable(imageRef, resizedImage);

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
                    localStorage.removeItem(notFoundKey);
                }
            );
        } catch (error) {
            console.error("Error resizing or uploading image:", error);
            setIsUploading(false);
        }
    };

    useEffect(() => {
        loadImage();
    }, [path]);

    return { imageUrl, isUploading, uploadProgress, uploadImage, reloadImage };
};