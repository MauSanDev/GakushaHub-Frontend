import React from 'react';
import { Link } from 'react-router-dom';

const NotificationScreen: React.FC<{ message: string }> = ({ message }) => {
    return (
        <div className="flex h-screen w-full">
            <div className="flex flex-1 justify-center items-center">
                <div className="w-full max-w-md p-8 space-y-8 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">{message}</h2>
                    <Link to="/login" className="mt-8 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                        Volver a Iniciar Sesión
                    </Link>
                </div>
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:items-center">
                <img
                    className="w-96 h-96 object-contain"
                    src="your-image-url-here"
                    alt="Your Illustration"
                />
            </div>
        </div>
    );
};

export default NotificationScreen;