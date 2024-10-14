import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut, User, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { ApiClient } from '../services/ApiClient';
import { UserData } from '../data/UserData';
import { MembershipRole, MembershipData } from '../data/MembershipData';
import { fetchFullPagination } from '../services/dataService.ts';
import { useQueryClient } from 'react-query';

type LicenseType = 'none' | 'free' | 'premium' | 'sensei';

interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    isAuthenticated: boolean;
    isEmailVerified: boolean;
    hasLicense: boolean;
    isPremium: boolean;
    isSensei: boolean;
    licenseType: LicenseType;
    memberships: MembershipData[] | null;
    membershipsLoading: boolean;
    getRole: (institutionId: string, creatorId: string) => Promise<MembershipRole>;
    refetchMemberships: () => void;
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
    const [membershipsLoading, setMembershipsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [memberships, setMemberships] = useState<MembershipData[] | null>(null);
    const queryClient = useQueryClient();  
    const [roleCache] = useState(new Map<string, MembershipRole>());

    const licenseType: LicenseType = userData?.licenses?.some(license => license.type === 'sensei' && license.isActive)
        ? 'sensei'
        : userData?.licenses?.some(license => license.type === 'premium' && license.isActive)
            ? 'premium'
            : userData?.licenses?.some(license => license.type === 'free' && license.isActive)
                ? 'free'
                : 'none';

    const hasLicense = licenseType !== 'none';
    const isPremium = licenseType === 'premium' || licenseType === 'sensei';
    const isSensei = licenseType === 'sensei';

    const fetchMemberships = async () => {
        if (userData?._id) {
            setMembershipsLoading(true);
            try {
                const result = await fetchFullPagination<MembershipData>(
                    1,  
                    99, 
                    'membership',
                    queryClient,
                    {},  
                    { userId: userData._id } 
                );

                if (result?.documents) {
                    console.log('Fetched memberships:', result.documents);
                    setMemberships(result.documents);
                    localStorage.setItem('memberships', JSON.stringify(result.documents));
                }
            } catch (error) {
                console.error('Error fetching memberships:', error);
            } finally {
                setMembershipsLoading(false);
            }
        }
    };

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

                fetchMemberships();
            } else {
                setIsAuthenticated(false);
                setIsEmailVerified(false);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [userData]);

    useEffect(() => {
        if (!memberships && userData?._id) {
            fetchMemberships();  
        }
    }, [userData, memberships]);

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

            fetchMemberships();
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
        setMemberships(null);
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
        localStorage.removeItem('memberships');
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

    const createCacheKey = (institutionId: string | null, creatorId: string): string => {
        return `${institutionId || 'null'}_${creatorId}`;
    };

    const getRole = async (institutionId: string | null, creatorId: string): Promise<MembershipRole> => {
        const cacheKey = createCacheKey(institutionId, creatorId);

        if (roleCache.has(cacheKey)) {
            return roleCache.get(cacheKey)!;
        }

        if (creatorId === userData?._id) {
            roleCache.set(cacheKey, MembershipRole.Owner);
            return MembershipRole.Owner;
        }

        if (institutionId) {
            const membership = memberships?.find(m =>
                m.institutionId === institutionId && m.userId === userData?._id
            );

            let newRole: MembershipRole = MembershipRole.None;

            if (membership) {
                switch (membership.role) {
                    case 'owner':
                        newRole = MembershipRole.Owner;
                        break;
                    case 'staff':
                        newRole = MembershipRole.Staff;
                        break;
                    case 'sensei':
                        newRole = MembershipRole.Sensei;
                        break;
                    case 'student':
                        newRole = MembershipRole.Student;
                        break;
                    default:
                        newRole = MembershipRole.None;
                        break;
                }
            }

            roleCache.set(cacheKey, newRole);
            return newRole;
        }

        roleCache.set(cacheKey, MembershipRole.None);
        return MembershipRole.None;
    };

    return (
        <AuthContext.Provider value={{
            user,
            userData,
            loading,
            isAuthenticated,
            isEmailVerified,
            hasLicense,
            isPremium,
            isSensei,
            licenseType,
            memberships,
            membershipsLoading,
            getRole,
            refetchMemberships: fetchMemberships,
            signUp,
            signIn,
            resetPassword,
            logout,
            resendEmailVerification,
            updateUserData,
            setupLicense
        }}>
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