import React, { useState, useRef } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import StudyGroupDataElement from './Institutions/Components/StudyGroupDataElement.tsx';
import { useMyStudyGroups } from '../hooks/institutionHooks/useMyStudyGroups';
import { useAuth } from '../context/AuthContext.tsx';

const MyStudyGroupsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { userData } = useAuth();

    const { data: studyGroups, isLoading } = useMyStudyGroups(userData?._id || '');

    // Verificación explícita de que studyGroups es un array
    const filteredStudyGroups = Array.isArray(studyGroups)
        ? studyGroups.filter(group => group.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    return (
        <div className="flex h-screen w-full">
            <div ref={scrollContainerRef}
                 className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">

                <LoadingScreen isLoading={isLoading} />

                <div className="lg:pl-0 pl-16 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-4xl mt-8 lg:mb-2 px-4">
                    <div className="flex items-start mb-4 sm:mb-0">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 capitalize">
                            My Study Groups
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
            </div>
        </div>
    );
};

export default MyStudyGroupsPage;