import React, {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import AuthLayout from './AuthLayout';
import {useAuth} from "../../context/AuthContext.tsx";

const PasswordResetScreen: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated)
            navigate("/search", { replace: true})
    }, [isAuthenticated]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Password reseted!');
    };

    return (
        <AuthLayout>
            <div className="max-w-md">
                <div className="w-full max-w-md p-8 space-y-8">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Reset Password
                    </h2>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <input
                            name="new-password"
                            type="password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Nueva Contraseña"
                        />
                        <input
                            name="confirm-password"
                            type="password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Confirmar Nueva Contraseña"
                        />
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Password Reseted
                        </button>
                    </form>
                    <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-white">
                            Back to Log In
                        </Link>
                    </div>
                </div>
            </div>
        </AuthLayout>
);
};

export default PasswordResetScreen;