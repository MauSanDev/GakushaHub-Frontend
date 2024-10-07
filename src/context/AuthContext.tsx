import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    getAuth,
    onAuthStateChanged,
    signOut,
    User,
    createUserWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from 'firebase/auth';
import { ApiClient } from '../services/ApiClient';
import { UserData } from '../data/UserData';

interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    isAuthenticated: boolean;
    isEmailVerified: boolean;
    hasLicense: boolean;
    isPremium: boolean;  // Nuevo campo para verificar si es premium
    isSensei: boolean;   // Nuevo campo para verificar si es sensei
    signUp: (email: string, password: string, name: string, country: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    logout: () => Promise<void>;
    resendEmailVerification: () => Promise<void>;
    updateUserData: (updatedFields: Partial<UserData>) => void;
    setupLicense: (licenseType: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(() => {
        const storedUserData = localStorage.getItem('userData');
        return storedUserData ? JSON.parse(storedUserData) : null;
    });
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    // Verificar si el usuario es premium o sensei
    const isPremium = userData?.licenses?.some(license => license.type === 'premium' && license.isActive) || false;
    const isSensei = userData?.licenses?.some(license => license.type === 'sensei' && license.isActive) || false;

    const hasLicense = isPremium || isSensei;  // Tiene licencia si es premium o sensei

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);

            if (user) {
                await handleTokenRefresh(user);

                const emailVerified = user.emailVerified;
                setIsAuthenticated(!!user && emailVerified);
                setIsEmailVerified(emailVerified);

                if (!userData && emailVerified) {
                    const data = await ApiClient.post<UserData, {}>('api/auth/login', {});
                    setUserData(data);
                    localStorage.setItem('userData', JSON.stringify(data));
                }
            } else {
                setIsAuthenticated(false);
                setIsEmailVerified(false);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [userData]);

    const handleTokenRefresh = async (user: User) => {
        try {
            const token = await user.getIdToken(true);
            localStorage.setItem('authToken', token);
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    };

    const signUp = async (email: string, password: string, name: string, country: string) => {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user) {
            await updateProfile(user, { displayName: name });
            await sendEmailVerification(user);

            await handleTokenRefresh(user);

            const data = await ApiClient.post<UserData, { name: string; email: string; country: string }>(
                'api/auth/register',
                { name, email, country }
            );
            setUserData(data);
            localStorage.setItem('userData', JSON.stringify(data));
        }

        setUser(user);
    };

    const signIn = async (email: string, password: string) => {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user) {
            await handleTokenRefresh(user);

            const data = await ApiClient.post<UserData, {}>('api/auth/login', {});
            setUserData(data);
            localStorage.setItem('userData', JSON.stringify(data));
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
        setIsAuthenticated(false);
        setIsEmailVerified(false);
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
    };

    const resendEmailVerification = async () => {
        if (user) {
            await sendEmailVerification(user);
            alert('Verification email sent. Please check your inbox.');
        }
    };

    const updateUserData = (updatedFields: Partial<UserData>) => {
        if (!userData) {
            console.error("No user data available to update");
            return;
        }

        const updatedUserData = { ...userData, ...updatedFields };
        setUserData(updatedUserData);
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
    };

    const setupLicense = async (licenseType: string) => {
        if (!userData) {
            console.error("No user data available to set license");
            return;
        }

        try {
            const updatedUserData = await ApiClient.post<UserData, { type: string }>('api/auth/license', { type: licenseType });

            setUserData(updatedUserData);
            localStorage.setItem('userData', JSON.stringify(updatedUserData));
        } catch (error) {
            console.error('Error setting up license:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userData, loading, isAuthenticated, isEmailVerified, hasLicense, isPremium, isSensei, signUp, signIn, resetPassword, logout, resendEmailVerification, updateUserData, setupLicense }}>
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