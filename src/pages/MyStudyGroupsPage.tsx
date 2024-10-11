import React, { useState } from 'react';
import StudyGroupDataElement from './Institutions/Components/StudyGroupDataElement.tsx';
import { useMyStudyGroups } from '../hooks/institutionHooks/useMyStudyGroups';
import { useAuth } from '../context/AuthContext.tsx';
import SectionContainer from "../components/ui/containers/SectionContainer.tsx";
import SearchBar from "../components/ui/inputs/SearchBar.tsx";

const MyStudyGroupsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const { userData } = useAuth();

    const { data: studyGroups, isLoading } = useMyStudyGroups(userData?._id || '');

    const filteredStudyGroups = Array.isArray(studyGroups)
        ? studyGroups.filter(group => group.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <SectionContainer title={"私の勉強グループ"} isLoading={isLoading}>
            <div className="w-full max-w-4xl flex flex-col text-left mt-12">
                <div className="flex items-center justify-between mb-4">
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="Search study groups..."
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