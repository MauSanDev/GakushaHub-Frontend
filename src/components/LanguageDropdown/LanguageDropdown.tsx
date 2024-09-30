import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';

const LanguageDropdown: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const { i18n } = useTranslation();

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'es', label: 'Español' },
        { code: 'zh', label: '中文' },
    ];

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = e.target.value;
        setLanguage(selectedLanguage);
        i18n.changeLanguage(selectedLanguage);
    };

    return (
        <select
            value={language}
            onChange={handleLanguageChange}
            className="transition-all px-2 py-1 w-full bg-white dark:bg-black border-none text-gray-400 font-bold text-sm hover:text-white hover:bg-blue-500 dark:text-gray-500 hover:dark:text-white dark:hover:bg-gray-800 rounded focus:outline-none"
        >
            {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                    {lang.label}
                </option>
            ))}
        </select>
    );
};

export default LanguageDropdown;