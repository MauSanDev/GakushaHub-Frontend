import React, {useEffect, useState} from 'react';
import { FaSpinner } from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';
import {useTranslation} from "react-i18next";

const ForgotPasswordScreen: React.FC = () => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if (isAuthenticated)
            navigate("/search", { replace: true})
    }, [isAuthenticated]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await resetPassword(email);
            setSuccess(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    {t("loginFlow.resetPassword")}
                </h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input
                        name="email"
                        type="email"
                        required
                        disabled={loading || success}
                        className="input-field"
                        placeholder={t("loginFlow.email")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading || success}
                        className={`w-full bg-blue-500 dark:bg-blue-800 text-white rounded py-2 px-4 hover:bg-blue-600 dark:hover:bg-blue-700 text-sm transition-all`}
                    >
                        {loading ? <FaSpinner className="animate-spin"/> : t("loginFlow.sendResetLink")}
                    </button>
                    {success && (
                        <p className="text-green-500 text-center mt-4">
                            {t("loginFlow.resetLinkSent")}
                        </p>
                    )}
                </form>
                <div className="text-center text-sm text-gray-600 dark:text-gray-300 py-4">
                    <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500 dark:text-white">
                        {t("loginFlow.backToSignIn")}
                    </Link>
                </div>
            </div>
        </AuthLayout>
);
};

export default ForgotPasswordScreen;