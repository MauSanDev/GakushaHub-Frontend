import React from 'react';
import AuthLayout from './AuthLayout';
import { useNavigate } from 'react-router-dom';

const LicenseSelectionPage: React.FC = () => {
    const navigate = useNavigate();

    const handlePurchase = (licenseType: string) => {
        // Aquí iría la lógica para procesar la compra
        console.log(`Comprando licencia: ${licenseType}`);
        navigate('/checkout'); // Redirige a la página de pago o checkout
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
                    {licensePlans.map((plan, index) => (
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

                            <button
                                onClick={() => handlePurchase(plan.title)}
                                className="mt-auto bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Select
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </AuthLayout>
    );
};

export default LicenseSelectionPage;