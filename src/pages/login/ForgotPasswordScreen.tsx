import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordScreen: React.FC = () => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Implementa la lógica de recuperación de contraseña con Firebase Auth
        alert('Enlace de recuperación enviado a tu correo.');
    };

    return (
        <div className="flex h-screen w-full">
            <div className="flex flex-1 justify-center items-center">
                <div className="w-full max-w-md p-8 space-y-8">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Recuperar Contraseña
                    </h2>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Email"
                        />
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Enviar enlace de recuperación
                        </button>
                    </form>
                    <div className="text-center text-sm text-gray-600">
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Volver a Iniciar Sesión
                        </Link>
                    </div>
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

export default ForgotPasswordScreen;