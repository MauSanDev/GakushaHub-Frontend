import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, AuthErrorCodes } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const SignInPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const auth = getAuth();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (error: any) {
            const code = error.code?.trim();
            switch (code) {
                case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
                    setError('The credentials you entered are not valid.');
                    break;
                case AuthErrorCodes.INVALID_EMAIL:
                    setError('The email address you entered is not valid.');
                    break;
                case AuthErrorCodes.USER_DISABLED:
                    setError('This account has been disabled.');
                    break;
                case AuthErrorCodes.USER_DELETED:
                    setError('No account found with this email address.');
                    break;
                case AuthErrorCodes.INVALID_PASSWORD:
                    setError('The password you entered is incorrect.');
                    break;
                default:
                    setError('An unexpected error occurred. Please try again later.');
                    break;
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full">
            <div className="flex flex-1 justify-center items-center">
                <div className="w-full max-w-md p-8 space-y-8">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign In
                    </h2>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <input
                            name="email"
                            type="email"
                            required
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            name="password"
                            type="password"
                            required
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="flex items-center justify-between">
                            <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot your password?
                            </Link>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? <FaSpinner className="animate-spin" /> : 'Sign In'}
                        </button>
                        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                    </form>
                    <div className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign Up
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

export default SignInPage;