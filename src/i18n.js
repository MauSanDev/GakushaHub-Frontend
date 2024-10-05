import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        supportedLngs: ['en', 'es', 'ja'],
        preload: ['en', 'ja'],
        fallbackLng: 'en',
        debug: true,
        detection: {
            order: ['cookie', 'localStorage', 'path', 'subdomain'],
            caches: ['cookie'],
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        ns: ['translation', 'grammar_jlpt2', 'grammar_jlpt3'],
        defaultNS: 'translation',
    });

export default i18n;