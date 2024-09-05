import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';

const ForgotPasswordScreen: React.FC = () => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

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
                Reset Password
            </h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <input
                    name="email"
                    type="email"
                    required
                    disabled={loading || success}
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={loading || success}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {loading ? <FaSpinner className="animate-spin" /> : 'Send Reset Link'}
                </button>
                {success && (
                    <p className="text-green-500 text-center mt-4">
                        Reset link sent successfully. Please check your email.
                    </p>
                )}
            </form>
            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-white">
                    Back to Sign In
                </Link>
            </div>
        </AuthLayout>
    );
};

export default ForgotPasswordScreen;