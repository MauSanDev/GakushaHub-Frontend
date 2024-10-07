import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaReact } from 'react-icons/fa';

const LicenseSelectionPage: React.FC = () => {
    const navigate = useNavigate();
    const { setupLicense, hasLicense, isPremium, isSensei } = useAuth(); 
    const [loading, setLoading] = useState<string | null>(null);

    const handleLicenseSetup = async (licenseType: string) => {
        let licenseKey = '';

        
        switch (licenseType) {
            case 'Free User':
                licenseKey = 'free';
                break;
            case 'Premium':
                licenseKey = 'premium';
                break;
            case 'Sensei':
                licenseKey = 'sensei';
                break;
            default:
                console.error('Unknown license type');
                return;
        }

        
        if ((licenseKey === 'free' && hasLicense)
            || (licenseKey === 'premium' && (isPremium || isSensei)) 
            || (licenseKey === 'sensei' && (isSensei))) 
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
        if (licenseType === 'Free User' && hasLicense) {
            return "You already have a License!";
        } else if (licenseType === 'Premium' && (isPremium || isSensei)) {
            return "You already have a Premium License!";
        } else if (licenseType === 'Sensei' && isSensei) {
            return "You already have a Premium License!";
        }
        return null;
    };

    const isButtonDisabled = (licenseType: string) => {
        if (licenseType === 'Free User' && (isPremium || isSensei)) return true;
        if (licenseType === 'Premium' && isSensei) return true;
        return false;
    };

    const licensePlans = [
        {
            title: "Free User",
            description: "For starters. Search and select your resources for self studying.",
            recommendedFor: "For students that want to search and check resources in Japanese.",
            price: "0 JPY",
        },
        {
            title: "Premium",
            description: "Create courses and resources for self studying. \nUse IA features to boost your practice and resources generation (Drills, Texts, Correction, and more).",
            price: "1500 JPY",
            recommendedFor: "For students that want to go to the next level, practice with focused IA and generate resources for practice.",
            tag: "Best",
        },
        {
            title: "Sensei",
            description: "Create your School with your group of students. Create shared resources for your courses and invite your students and other Senseis to participate.",
            recommendedFor: "For particular Senseis, Schools and Organizations that want to manage and provide resources for their students.",
            price: "21,970 JPY",
        },
    ];

    return (
        <AuthLayout>
            <div className="max-w-4xl mx-auto">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Licenses
                </h2>
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {licensePlans.map((plan, index) => {
                        const blockedReason = getBlockedReason(plan.title);
                        return (
                            <div key={index} className="relative border rounded-lg p-6 shadow-lg flex flex-col dark:hover:bg-gray-800 hover:bg-blue-100 transition-all">
                                {plan.tag && (
                                    <div
                                        className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                                        {plan.tag}
                                    </div>
                                )}
                                <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                                <p className="text-gray-400 mb-10 h-40">{plan.description}</p>
                                <div className="border-t border-b border-gray-200 dark:border-gray-800 h-40 mb-8">
                                    <p className="dark:text-gray-300 text-gray-800 font-bold pt-5">Recommended for:</p>
                                    <p className="text-gray-500 mb-4">{plan.recommendedFor}</p>
                                </div>
                                <p className="text-lg font-bold pb-4">{plan.price}</p>


                                {blockedReason ? (
                                        <p className="text-red-500 text-sm mt-2">{blockedReason}</p>
                                    ) :
                                    <button
                                        onClick={() => handleLicenseSetup(plan.title)}
                                        className={`mt-auto bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'cursor-not-allowed' : ''}`}
                                        disabled={!!loading || isButtonDisabled(plan.title)}
                                    >
                                        {loading === plan.title ? (
                                            <FaReact className="animate-spin mx-auto" size={24}/>
                                        ) : (
                                            'Select'
                                        )}
                                    </button>
                                }
                            </div>
                        );
                    })}
                </div>
            </div>
        </AuthLayout>
    );
};

export default LicenseSelectionPage;