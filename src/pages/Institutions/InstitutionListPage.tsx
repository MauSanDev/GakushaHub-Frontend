import React, { useState, useRef } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import LocSpan from '../../components/LocSpan.tsx';
import InstitutionBox from './Components/InstitutionBox.tsx';
import CreateInstitutionModal from './CreateInstitutionModal';
import { usePaginatedInstitutions } from '../../hooks/institutionHooks/usePaginatedInstitutions';

const InstitutionListPage: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data, error, isLoading } = usePaginatedInstitutions(1, 1); 

    const ownerInstitution = data?.documents[0] || null;

    const handleCreateInstitutionSuccess = () => {
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
                    {error ? (
                        <p className="text-red-500 text-center">Error fetching institutions</p>
                    ) : ownerInstitution ? (
                        <InstitutionBox
                            institutionId={ownerInstitution._id}
                            institutionName={ownerInstitution.name}
                            institutionDescription={ownerInstitution.description}
                            members={ownerInstitution.members || 0}
                            groups={ownerInstitution.groups || 0}
                            resources={ownerInstitution.resources || 0}
                            userRole="owner"
                        />
                    ) : (
                        <div
                            className="p-6 my-10 border-2 border-dashed border-gray-400 dark:border-gray-600 hover:dark:border-green-800 hover:border-green-700 rounded-lg shadow-md text-center cursor-pointer transition-all hover:bg-green-100 dark:hover:bg-green-950 flex items-center justify-center h-48 text-gray-600 dark:text-gray-400 hover:dark:text-green-400 hover:text-green-700 "
                            onClick={() => setIsCreateModalOpen(true)} 
                        >
                            <p className="mb-4 text-xl">
                                You don't have your Institution yet.<br/>
                                <span>Click here to Create</span>
                            </p>
                        </div>
                    )}
                </div>

            </div>

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