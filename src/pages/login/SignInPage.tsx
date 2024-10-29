import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout.tsx';
import LocSpan from "../../components/LocSpan.tsx";
import {useTranslation} from "react-i18next";

const SignInPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { signIn, isAuthenticated } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if (isAuthenticated)
            navigate("/search", { replace: true})
    }, [isAuthenticated]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await signIn(email, password);
            navigate("/search");
        } catch (error: any) {
            const code = error.code?.trim();
            switch (code) {
                case 'auth/invalid-email':
                    setError(t("loginFlow.invalidEmail"));
                    break;
                case 'auth/user-disabled':
                    setError(t("loginFlow.disabledAccount"));
                    break;
                case 'auth/user-not-found':
                    setError(t("loginFlow.noAccountFound"));
                    break;
                case 'auth/wrong-password':
                    setError(t("loginFlow.incorrectPassword"));
                    break;
                default:
                    setError(t("loginFlow.unexpectedError"));
                    break;
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"><LocSpan
                    textKey={"loginFlow.logIn"}/></h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input
                        name="email"
                        type="email"
                        required
                        disabled={loading}
                        className="input-field"
                        placeholder={t("loginFlow.email")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        name="password"
                        type="password"
                        required
                        disabled={loading}
                        className="input-field"
                        placeholder={t("loginFlow.password")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex items-center justify-between">
                        <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                            <LocSpan textKey={"loginFlow.forgotPassword"}/>
                        </Link>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-500 dark:bg-blue-800 text-white rounded py-2 px-4 hover:bg-blue-600 dark:hover:bg-blue-700 text-sm transition-all`}
                    >
                        {loading ? <FaSpinner className="animate-spin"/> : <LocSpan textKey={"loginFlow.logIn"}/>}
                    </button>
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                </form>
                <div className="text-center text-sm text-gray-600 dark:text-gray-300 py-4">
                    <LocSpan textKey={"loginFlow.dontHaveAccount"}/>
                    {' '}
                    <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                        <LocSpan textKey={"loginFlow.signUp"}/>
                    </Link>
                </div>
            </div>
        </AuthLayout>
);
};

export default SignInPage;