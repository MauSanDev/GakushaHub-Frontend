import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginScreen: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Implementa la lógica de autenticación con Firebase Auth
        if (isLogin) {
            // Login logic
        } else {
            // Sign up logic
        }
    };

    return (
        <div className="flex h-screen w-full">
            <div className="flex flex-1 justify-center items-center">
                <div className="w-full max-w-lg p-8 space-y-8"> {/* Ampliado max-w-md a max-w-lg */}
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
                    </h2>
                    <div className="mt-8 space-y-6">
                        <button
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Continuar con Google
                        </button>
                        <button
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Continuar con Facebook
                        </button>
                        <button
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Continuar con Apple
                        </button>
                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    O usa tu cuenta de email
                                </span>
                            </div>
                        </div>
                        <form className="mt-8 space-y-6 w-full" onSubmit={handleSubmit}>
                            {!isLogin && (
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Nombre"
                                />
                            )}
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Email"
                            />
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Contraseña"
                            />
                            <div className="flex items-center justify-between">
                                {isLogin && (
                                    <div className="text-sm">
                                        <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                                            ¿Olvidaste tu contraseña?
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {isLogin ? 'Iniciar sesión' : 'Registrarse'}
                            </button>
                        </form>
                        <div className="text-center text-sm text-gray-600">
                            {isLogin ? (
                                <>
                                    ¿No tienes cuenta?{' '}
                                    <button
                                        onClick={() => setIsLogin(false)}
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Regístrate
                                    </button>
                                </>
                            ) : (
                                <>
                                    ¿Ya tienes una cuenta?{' '}
                                    <button
                                        onClick={() => setIsLogin(true)}
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Inicia sesión
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:items-center">
                <img
                    className="w-full max-w-2xl h-auto object-contain"  // Ampliado el ancho
                    src="your-image-url-here"
                    alt="Your Illustration"
                />
            </div>
        </div>
    );
};

export default LoginScreen;