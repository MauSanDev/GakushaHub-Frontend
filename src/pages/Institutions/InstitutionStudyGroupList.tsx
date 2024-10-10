import React, { useState, useRef } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import StudyGroupDataElement from './Components/StudyGroupDataElement.tsx';
import AddStudyGroupModal from './AddStudyGroupModal.tsx';
import { useParams } from "react-router-dom";
import { usePaginatedStudyGroups } from '../../hooks/institutionHooks/usePaginatedStudyGroups';

const InstitutionStudyGroupPage: React.FC = () => {
    const { institutionId } = useParams<{ institutionId: string }>();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState<boolean>(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data: studyGroupsData, isLoading } = usePaginatedStudyGroups(1, 10, institutionId || ""); // Page = 1, Limit = 10

    const handleAddGroupSuccess = () => {
        setIsAddGroupModalOpen(false);
    };

    const filteredStudyGroups = studyGroupsData?.documents.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="flex h-screen w-full">
            <div ref={scrollContainerRef}
                 className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">

                <LoadingScreen isLoading={isLoading} />

                <div className="lg:pl-0 pl-16 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-4xl mt-8 lg:mb-2 px-4">
                    <div className="flex items-start mb-4 sm:mb-0">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 capitalize">
                            グループ
                        </h1>
                    </div>
                </div>

                <div className="w-full max-w-4xl flex flex-col text-left mt-12">
                    <div className="flex items-center justify-between mb-4">
                        {/* Search bar */}
                        <input
                            type="text"
                            placeholder="Search study groups..."
                            className="px-4 py-2 w-full lg:w-1/2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {/* Botón para agregar un grupo de estudio */}
                        <button
                            className="flex justify-center text-center text-sm border dark:border-gray-700 rounded-full px-5 py-2 transition-all duration-300 transform lg:hover:scale-105 hover:shadow-md items-center gap-2 bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-blue-300 hover:text-white"
                            onClick={() => setIsAddGroupModalOpen(true)}
                        >
                            ＋ Add Study Group
                        </button>
                    </div>

                    <div>
                        {filteredStudyGroups.length > 0 ? (
                            filteredStudyGroups.map((group) => (
                                <StudyGroupDataElement
                                    key={group._id}
                                    studyGroup={group}
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No study groups found</p>
                        )}
                    </div>
                </div>

                {isAddGroupModalOpen && (
                    <AddStudyGroupModal
                        onClose={() => setIsAddGroupModalOpen(false)}
                        onCreateSuccess={handleAddGroupSuccess}
                        institutionId={institutionId || ""}
                    />
                )}
            </div>
        </div>
    );
};

export default InstitutionStudyGroupPage;