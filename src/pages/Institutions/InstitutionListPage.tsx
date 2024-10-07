import React, { useState, useEffect, useRef } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import LocSpan from '../../components/LocSpan.tsx';
import InstitutionBox from './Components/InstitutionBox.tsx';
import CreateInstitutionModal from './CreateInstitutionModal'; // Importa el modal de creación de institución

interface InstitutionData {
    _id: string;
    name: string;
    description?: string;
    members?: number;
    groups?: number;
    resources?: number;
    role: string;
}

const InstitutionListPage: React.FC = () => {
    const [institutions, setInstitutions] = useState<InstitutionData[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false); // Estado para manejar el modal
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const hasOwnerInstitution: boolean = false;

    const ownerInstitution: InstitutionData | null = hasOwnerInstitution
        ? { _id: 'owner-1', name: 'My Institution', description: 'A brief description of the institution.', members: 120, groups: 5, resources: 10, role: 'owner' }
        : null;

    const isLoading = false;

    useEffect(() => {
        const dummyInstitutions: InstitutionData[] = [
            { _id: '1', name: 'Institution A', description: 'A brief description of Institution A', members: 80, groups: 3, resources: 7, role: 'member' },
            { _id: '2', name: 'Institution B', description: 'A brief description of Institution B', members: 50, groups: 2, resources: 5, role: 'member' }
        ];
        setInstitutions(dummyInstitutions);
    }, []);

    const handleCreateInstitutionSuccess = () => {
        // Aquí puedes actualizar la lista de instituciones después de que se cree una nueva
        setIsCreateModalOpen(false);
    };

    return (
        <div ref={scrollContainerRef}
             className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">

            <LoadingScreen isLoading={isLoading} />

            <div className="lg:pl-0 pl-16 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-4xl mt-8 lg:mb-2 px-4">
                <div className="flex items-start mb-4 sm:mb-0">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 capitalize">
                        私の学校
                    </h1>
                </div>
            </div>

            <div className="w-full max-w-4xl flex flex-col gap-6 text-left pb-24">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        <LocSpan textKey={"institutionListPage.myInstitution"} />
                    </h2>
                    {ownerInstitution ? (
                        <InstitutionBox
                            institutionName={ownerInstitution.name}
                            institutionDescription={ownerInstitution.description}
                            members={ownerInstitution.members}
                            groups={ownerInstitution.groups}
                            resources={ownerInstitution.resources}
                            userRole={ownerInstitution.role}
                        />
                    ) : (
                        <div
                            className="p-6 my-10 border-2 border-dashed border-gray-400 dark:border-gray-600 hover:dark:border-green-800 hover:border-green-700 rounded-lg shadow-md text-center cursor-pointer transition-all hover:bg-green-100 dark:hover:bg-green-950 flex items-center justify-center h-48 text-gray-600 dark:text-gray-400 hover:dark:text-green-400 hover:text-green-700 "
                            onClick={() => setIsCreateModalOpen(true)} // Abre el modal al hacer clic
                        >
                            <p className="mb-4 text-xl">
                                You don't have your Institution yet.<br/>
                                <span>Click here to Create</span>
                            </p>
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        <LocSpan textKey={"institutionListPage.joinedInstitutions"}/>
                    </h2>
                    {institutions.length > 0 ? (
                        institutions.map((institution) => (
                            <InstitutionBox
                                key={institution._id}
                                institutionName={institution.name}
                                institutionDescription={institution.description}
                                members={institution.members}
                                groups={institution.groups}
                                resources={institution.resources}
                                userRole={institution.role}
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-500">何もない</p>
                    )}
                </div>
            </div>

            {/* Modal para crear institución */}
            {isCreateModalOpen && (
                <CreateInstitutionModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreateSuccess={handleCreateInstitutionSuccess}
                />
            )}
        </div>
    );
};

export default InstitutionListPage;