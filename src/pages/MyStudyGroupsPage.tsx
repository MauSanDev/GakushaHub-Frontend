import React, { useState } from 'react';
import StudyGroupDataElement from './Institutions/Components/StudyGroupDataElement.tsx';
import { useMyStudyGroups } from '../hooks/institutionHooks/useMyStudyGroups';
import { useAuth } from '../context/AuthContext.tsx';
import SectionContainer from "../components/ui/containers/SectionContainer.tsx";

const MyStudyGroupsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { userData } = useAuth();

    const { data: studyGroups, isLoading } = useMyStudyGroups(userData?._id || '');

    const filteredStudyGroups = Array.isArray(studyGroups)
        ? studyGroups.filter(group => group.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    return (

        <SectionContainer title={"私の勉強グループ"} isLoading={isLoading}>
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
        </SectionContainer>
    );
};

export default MyStudyGroupsPage;