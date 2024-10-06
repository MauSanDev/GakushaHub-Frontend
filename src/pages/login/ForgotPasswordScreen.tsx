import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';
import {useTranslation} from "react-i18next";

const ForgotPasswordScreen: React.FC = () => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { t } = useTranslation();

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
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                {t("loginFlow.resetPassword")}
            </h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <input
                    name="email"
                    type="email"
                    required
                    disabled={loading || success}
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={t("loginFlow.email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={loading || success}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {loading ? <FaSpinner className="animate-spin" /> : t("loginFlow.sendResetLink")}
                </button>
                {success && (
                    <p className="text-green-500 text-center mt-4">
                        {t("loginFlow.resetLinkSent")}
                    </p>
                )}
            </form>
            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500 dark:text-white">
                    {t("loginFlow.backToSignIn")}
                </Link>
            </div>
        </AuthLayout>
    );
};

export default ForgotPasswordScreen;