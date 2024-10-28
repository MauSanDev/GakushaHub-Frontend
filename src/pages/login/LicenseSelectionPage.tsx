import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaReact } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const LicenseSelectionPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { setupLicense, hasLicense, isPremium, isSensei } = useAuth();
    const [loading, setLoading] = useState<string | null>(null);

    const handleLicenseSetup = async (licenseType: string) => {
        let licenseKey = '';

        switch (licenseType) {
            case t("licensesPage.freeUserTitle"):
                licenseKey = 'free';
                break;
            case t("licensesPage.premiumTitle"):
                licenseKey = 'premium';
                break;
            case t("licensesPage.senseiTitle"):
                licenseKey = 'sensei';
                break;
            default:
                console.error('Unknown license type');
                return;
        }

        if ((licenseKey === 'free' && hasLicense)
            || (licenseKey === 'premium' && (isPremium || isSensei))
            || (licenseKey === 'sensei' && isSensei))
        {
            navigate('/');
            return;
        }

        setLoading(licenseType);

        try {
            await setupLicense(licenseKey);
            navigate('/');
        } catch (error) {
            console.error('Error setting up license:', error);
        } finally {
            setLoading(null);
        }
    };

    const getBlockedReason = (licenseType: string) => {
        if (licenseType === t("licensesPage.freeUserTitle") && hasLicense) {
            return t("licensesPage.alreadyHaveLicense");
        } else if (licenseType === t("licensesPage.premiumTitle") && (isPremium || isSensei)) {
            return t("licensesPage.alreadyHavePremium");
        } else if (licenseType === t("licensesPage.senseiTitle") && isSensei) {
            return t("licensesPage.alreadyHaveSensei");
        }
        return null;
    };

    const isButtonDisabled = (licenseType: string) => {
        if (licenseType === t("licensesPage.freeUserTitle") && (isPremium || isSensei)) return true;
        if (licenseType === t("licensesPage.premiumTitle") && isSensei) return true;
        return false;
    };

    const licensePlans = [
        {
            title: t("licensesPage.freeUserTitle"),
            description: t("licensesPage.freeUserDescription"),
            recommendedFor: t("licensesPage.freeUserRecommendedFor"),
            price: t("licensesPage.freeUserPrice"),
        },
        {
            title: t("licensesPage.premiumTitle"),
            description: t("licensesPage.premiumDescription"),
            recommendedFor: t("licensesPage.premiumRecommendedFor"),
            price: t("licensesPage.premiumPrice"),
            tag: t("licensesPage.premiumTag"),
        },
        {
            title: t("licensesPage.senseiTitle"),
            description: t("licensesPage.senseiDescription"),
            recommendedFor: t("licensesPage.senseiRecommendedFor"),
            price: t("licensesPage.senseiPrice"),
        },
    ];

    return (
        <AuthLayout>
            <div className="max-w-4xl mx-auto overflow-hidden">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    {t("licensesPage.title")}
                </h2>
                <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 pb-20 overflow-y-auto max-h-[60vh] lg:max-h-full">
                    {licensePlans.map((plan, index) => {
                        const blockedReason = getBlockedReason(plan.title);
                        return (
                            <div
                                key={index}
                                className="relative border rounded-lg p-4 sm:p-6 shadow-lg flex flex-col 
                                            dark:border-gray-600 dark:hover:bg-gray-800 hover:bg-blue-100 
                                            transition-all text-sm sm:text-base">
                                {plan.tag && (
                                    <div
                                        className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                                        {plan.tag}
                                    </div>
                                )}
                                <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800 dark:text-white">{plan.title}</h3>
                                <p className="text-gray-400 mb-4 sm:mb-10 h-24 sm:h-40">{plan.description}</p>
                                <div className="border-t border-b border-gray-200 dark:border-gray-800 h-24 sm:h-40 mb-4 sm:mb-8">
                                    <p className="dark:text-gray-300 text-gray-800 font-bold pt-3 sm:pt-5">
                                        {t("licensesPage.recommendedForLabel")}
                                    </p>
                                    <p className="text-gray-500">{plan.recommendedFor}</p>
                                </div>
                                <p className="text-base sm:text-lg font-bold pb-2 sm:pb-4 text-gray-800 dark:text-white">
                                    {plan.price}
                                </p>

                                {blockedReason ? (
                                    <p className="text-red-500 text-xs sm:text-sm mt-2">{blockedReason}</p>
                                ) : (
                                    <button
                                        onClick={() => handleLicenseSetup(plan.title)}
                                        className={`mt-auto bg-blue-600 text-white font-bold py-1 sm:py-2 px-3 sm:px-4 rounded hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'cursor-not-allowed' : ''}`}
                                        disabled={!!loading || isButtonDisabled(plan.title)}
                                    >
                                        {loading === plan.title ? (
                                            <FaReact className="animate-spin mx-auto" size={20}/>
                                        ) : (
                                            t("licensesPage.selectButton")
                                        )}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </AuthLayout>
    );
};

export default LicenseSelectionPage;