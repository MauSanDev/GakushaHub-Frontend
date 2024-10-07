import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LoadingScreen from '../../components/LoadingScreen';
import LocSpan from '../../components/LocSpan.tsx';

interface InstitutionData {
    _id: string;
    name: string;
}

const InstitutionListPage: React.FC = () => {
    const [institutions, setInstitutions] = useState<InstitutionData[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Placeholder para simular si el usuario tiene una institución propia
    const ownerInstitution: InstitutionData | null = null; // Cambia esto cuando tengas los datos reales
    const isLoading = false; // Placeholder para la pantalla de carga

    // Simulación de instituciones a las que el usuario pertenece
    useEffect(() => {
        const dummyInstitutions: InstitutionData[] = [
            { _id: '1', name: 'Institution A' },
            { _id: '2', name: 'Institution B' }
        ];
        setInstitutions(dummyInstitutions);
    }, []);

    return (
        <div ref={scrollContainerRef}
             className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">

            <LoadingScreen isLoading={isLoading} />

            <div className="lg:pl-0 pl-16 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-4xl mt-8 lg:mb-2 px-4">
                <div className="flex items-start mb-4 sm:mb-0">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 capitalize">
                        インスティテューションを見つけましょう
                    </h1>
                </div>
            </div>

            <div className="w-full max-w-4xl flex flex-col gap-6 text-left pb-24">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        <LocSpan textKey={"institutionListPage.myInstitution"} />
                    </h2>
                    {ownerInstitution ? (
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            {/* Aquí iría tu componente de datos de la organización */}
                            <p className="text-gray-700 dark:text-gray-300">My Data</p>
                        </div>
                    ) : (
                        <p className="text-gray-500">You don't have an institution created yet.</p>
                    )}
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        <LocSpan textKey={"institutionListPage.joinedInstitutions"} />
                    </h2>
                    {institutions.length > 0 ? (
                        institutions.map((institution) => (
                            <Link key={institution._id} to={`/institutions/${institution._id}`} className="page-fade-enter page-fade-enter-active">
                                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <p className="text-gray-700 dark:text-gray-300">{institution.name}</p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-500">You are not part of any institution yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstitutionListPage;