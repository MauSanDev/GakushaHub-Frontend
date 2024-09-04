import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageDropdown: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'es', label: 'Español' },
        { code: 'zh', label: '中文' },
        // { code: 'hi', label: 'हिन्दी' },
        // { code: 'ar', label: 'العربية' },
        // { code: 'fr', label: 'Français' },
        // { code: 'ru', label: 'Русский' },
        // { code: 'pt', label: 'Português' },
        // { code: 'ja', label: '日本語' },
        // { code: 'de', label: 'Deutsch' },
        // { code: 'ko', label: '한국어' },
        // { code: 'it', label: 'Italiano' },
        // { code: 'vi', label: 'Tiếng Việt' },
        // { code: 'tr', label: 'Türkçe' },
    ];

    return (
        <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 bg-white dark:bg-black border-none text-gray-800 dark:text-gray-200 font-bold text-sm hover:text-blue-500 focus:outline-none"
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