import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut, User, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { ApiClient } from '../services/ApiClient';
import { UserData } from '../data/UserData';

interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    signUp: (email: string, password: string, name: string, country: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(() => {
        const storedUserData = localStorage.getItem('userData');
        return storedUserData ? JSON.parse(storedUserData) : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                // Intenta obtener el userData si no está cargado
                if (!userData) {
                    const token = await user.getIdToken();
                    localStorage.setItem('authToken', token);

                    const data = await ApiClient.post<UserData, {}>('api/auth/login', {});
                    setUserData(data);
                    localStorage.setItem('userData', JSON.stringify(data)); // Guarda en localStorage
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userData]);

    const signUp = async (email: string, password: string, name: string, country: string) => {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user) {
            await updateProfile(user, { displayName: name });
            await sendEmailVerification(user);

            const token = await user.getIdToken();
            localStorage.setItem('authToken', token);

            const data = await ApiClient.post<UserData, { name: string; email: string; country: string }>(
                'api/auth/register',
                { name, email, country }
            );
            setUserData(data);
            localStorage.setItem('userData', JSON.stringify(data)); // Guarda en localStorage
        }

        setUser(user);
    };

    const signIn = async (email: string, password: string) => {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user) {
            const token = await user.getIdToken();
            localStorage.setItem('authToken', token);

            const data = await ApiClient.post<UserData, {}>('api/auth/login', {});
            setUserData(data);
            localStorage.setItem('userData', JSON.stringify(data)); // Guarda en localStorage
        }

        setUser(user);
    };

    const resetPassword = async (email: string) => {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, email);
    };

    const logout = async () => {
        const auth = getAuth();
        await signOut(auth);
        setUser(null);
        setUserData(null);
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ user, userData, loading, signUp, signIn, resetPassword, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};