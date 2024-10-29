import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { countryList } from '../../utils/countryList';
import AuthLayout from './AuthLayout';
import {useTranslation} from "react-i18next";

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
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated)
            navigate("/search", { replace: true})
    }, [isAuthenticated]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError(t("loginFlow.errors.passwordMismatch"));
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password, name, country);
            navigate('/signinsuccess');
        } catch (error: any) {
            setError(error.message || t("loginFlow.errors.unexpectedError"));
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
        <AuthLayout>
            <div className="max-w-md" >
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Sign Up</h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <input
                    name="name"
                    type="text"
                    required
                    disabled={loading}
                    className="input-field"
                    placeholder={t("loginFlow.name")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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

                {/* Dropdown de países */}
                <select
                    name="country"
                    required
                    disabled={loading}
                    className="input-field"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                >
                    <option value="" disabled>
                        {t("loginFlow.selectCountry")}
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
                        className="input-field"
                        placeholder={t("loginFlow.password")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setShowRequirements(true)}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 text-gray-600 dark:text-gray-300 right-0 pr-3 flex items-center text-sm leading-5"
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
                        className="input-field"
                        placeholder={t("loginFlow.confirmPassword")}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setShowRequirements(true)}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 text-gray-800 dark:text-gray-300 right-0 pr-3 flex items-center text-sm leading-5"
                        onClick={toggleConfirmPasswordVisibility}
                    >
                        {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {showRequirements && (
                    <ul className="text-sm space-y-1 mt-4 transition-opacity duration-500 ease-in-out opacity-100 text-gray-800 dark:text-gray-400">
                        <li className="flex items-center">
                            {passwordValidation.length ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                            <span className="ml-2">{t("loginFlow.passwordTips.atLeastEight")}</span>
                        </li>
                        <li className="flex items-center">
                            {passwordValidation.lowercase ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                            <span className="ml-2">{t("loginFlow.passwordTips.lowercase")}</span>
                        </li>
                        <li className="flex items-center">
                            {passwordValidation.uppercase ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                            <span className="ml-2">{t("loginFlow.passwordTips.uppercase")}</span>
                        </li>
                        <li className="flex items-center">
                            {passwordValidation.number ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                            <span className="ml-2">{t("loginFlow.passwordTips.number")}</span>
                        </li>
                        <li className="flex items-center">
                            {passwordValidation.specialChar ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                            <span className="ml-2">{t("loginFlow.passwordTips.specialChar")}</span>
                        </li>
                        <li className="flex items-center">
                            {passwordsMatch ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                            <span className="ml-2">{t("loginFlow.passwordTips.passwordMatch")}</span>
                        </li>
                    </ul>
                )}

                <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className={`w-full bg-blue-500 dark:bg-blue-800 text-white rounded py-2 px-4 hover:bg-blue-600 dark:hover:bg-blue-700 text-sm transition-all ${isFormValid ? 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' : 'opacity-50 bg-gray-400 cursor-not-allowed'}`}
                >
                    {loading ? <FaSpinner className="animate-spin" /> : t("loginFlow.signUp")}
                </button>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </form>

            <div className="text-center text-sm text-gray-600 dark:text-gray-300 py-4">
                {t("loginFlow.haveAccount")}{' '}
                <button
                    onClick={() => navigate('/signin')}
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    {t("loginFlow.logIn")}
                </button>
            </div>
            </div>
        </AuthLayout>
    );
};

export default SignUpPage;