import React, { useState, useEffect, useRef } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import InstitutionStudyGroupBox from './Components/InstitutionStudyGroupBox.tsx';
import AddStudyGroupModal from './AddStudyGroupModal.tsx'; // Modal para agregar grupos de estudio

interface StudyGroupData {
    _id: string;
    name: string;
    description?: string;
    members?: number;
    teachers?: number;
    courses?: number;
    resources?: number;
}

const InstitutionStudyGroupPage: React.FC = () => {
    const [studyGroups, setStudyGroups] = useState<StudyGroupData[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState<boolean>(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isLoading = false;

    useEffect(() => {
        const dummyStudyGroups: StudyGroupData[] = [
            { _id: '1', name: 'Study Group A', description: 'Brief description of Study Group A', members: 10, teachers: 5, resources: 7, courses: 4 },
            { _id: '2', name: 'Study Group B', description: 'Brief description of Study Group B', members: 15, teachers: 3, resources: 7, courses: 4 },
        ];
        setStudyGroups(dummyStudyGroups);
    }, []);

    const handleAddGroupSuccess = () => {
        setIsAddGroupModalOpen(false);
        // Aquí puedes agregar lógica para actualizar la lista de grupos de estudio
    };

    // Función para filtrar los grupos de estudio en base al searchQuery
    const filteredStudyGroups = studyGroups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                                <InstitutionStudyGroupBox
                                    key={group._id}
                                    groupName={group.name}
                                    groupDescription={group.description}
                                    members={group.members}
                                    teachers={group.teachers}
                                    courses={group.courses}
                                    resources={group.resources}
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
                        onAddSuccess={handleAddGroupSuccess}
                    />
                )}
            </div>
        </div>
    );
};

export default InstitutionStudyGroupPage;