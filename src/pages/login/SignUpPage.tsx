import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import signinImg from "../../assets/page-img.jpg";
import {countryList} from '../../utils/countryList.ts';

const SignUpPage: React.FC = () => {
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [country, setCountry] = useState(''); // Estado para el país seleccionado
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [showRequirements, setShowRequirements] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password, name, country); // Agrega el país al método signUp
            navigate('/signinsuccess');
        } catch (error: any) {
            // Manejo de errores según sea necesario
            setError(error.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const validatePassword = (password: string) => {
        return {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            specialChar: /[.!@#$%^&*]/.test(password),
        };
    };

    const passwordValidation = validatePassword(password);
    const passwordsMatch = password && confirmPassword && password === confirmPassword;

    const isFormValid = Object.values(passwordValidation).every(Boolean) && passwordsMatch && email && name && country;

    return (
        <div className="flex h-screen w-full">
            <div className="flex flex-1 justify-center items-center">
                <div className="w-full max-w-md p-8 space-y-8">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign Up
                    </h2>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <input
                            name="name"
                            type="text"
                            required
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
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

                        {/* Dropdown de países */}
                        <select
                            name="country"
                            required
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        >
                            <option value="" disabled>
                                Select your country
                            </option>
                            {Object.entries(countryList).map(([code, name]) => (
                                <option key={code} value={code}>
                                    {name}
                                </option>
                            ))}
                        </select>

                        <div className="relative">
                            <input
                                name="password"
                                type={passwordVisible ? 'text' : 'password'}
                                required
                                disabled={loading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setShowRequirements(true)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                onClick={togglePasswordVisibility}
                            >
                                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                name="confirmPassword"
                                type={confirmPasswordVisible ? 'text' : 'password'}
                                required
                                disabled={loading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onFocus={() => setShowRequirements(true)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {showRequirements && (
                            <ul className="text-sm space-y-1 mt-4 transition-opacity duration-500 ease-in-out opacity-100">
                                <li className="flex items-center">
                                    {passwordValidation.length ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                                    <span className="ml-2">At least 8 characters</span>
                                </li>
                                <li className="flex items-center">
                                    {passwordValidation.lowercase ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                                    <span className="ml-2">Contains a lowercase letter</span>
                                </li>
                                <li className="flex items-center">
                                    {passwordValidation.uppercase ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                                    <span className="ml-2">Contains an uppercase letter</span>
                                </li>
                                <li className="flex items-center">
                                    {passwordValidation.number ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                                    <span className="ml-2">Contains a number</span>
                                </li>
                                <li className="flex items-center">
                                    {passwordValidation.specialChar ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                                    <span className="ml-2">Contains a special character (!@#$%^&*)</span>
                                </li>
                                <li className="flex items-center">
                                    {passwordsMatch ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                                    <span className="ml-2">Passwords match</span>
                                </li>
                            </ul>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !isFormValid}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isFormValid ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            {loading ? <FaSpinner className="animate-spin" /> : 'Sign Up'}
                        </button>
                        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                    </form>
                    <div className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/signin')}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:items-center pr-40">
                <img
                    className="object-contain"
                    src={signinImg}
                    alt="Your Illustration"
                />
            </div>
        </div>
    );
};

export default SignUpPage;