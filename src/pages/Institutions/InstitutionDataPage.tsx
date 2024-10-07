import React, { useState, useRef } from 'react';
import LoadingScreen from "../../components/LoadingScreen";
import LocSpan from "../../components/LocSpan.tsx";

const InstitutionDataPage: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<'studyGroups' | 'members' | 'courses' | 'resources' | 'profile'>('studyGroups');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleTabChange = (tab: 'studyGroups' | 'members' | 'courses' | 'resources' | 'profile') => {
        setCurrentTab(tab);
    };

    const renderTabContent = () => {
        switch (currentTab) {
            case 'studyGroups':
                return <div>Study Groups content goes here</div>;
            case 'members':
                return <div>Members content goes here</div>;
            case 'courses':
                return <div>Courses content goes here</div>;
            case 'resources':
                return <div>Resources content goes here</div>;
            case 'profile':
                return <div>Profile content goes here</div>;
            default:
                return null;
        }
    };

    return (
        <div ref={scrollContainerRef}
             className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">

            <LoadingScreen isLoading={false} />

            <div className="lg:pl-0 pl-16 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-4xl mt-8 lg:mb-2 px-4">
                <div className="flex items-start mb-4 sm:mb-0">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 capitalize">
                        学びましょう
                    </h1>
                </div>
            </div>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => handleTabChange('studyGroups')}
                    className={`px-4 py-2 rounded lg:text-sm text-xs transition-all border ${currentTab === 'studyGroups' ? 'bg-blue-500 dark:bg-gray-600 text-white dark:text-white dark:border-gray-800 ' : 'text-gray-500 bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}>
                    <LocSpan textKey={"institutionDataPage.studyGroups"} />
                </button>
                <button
                    onClick={() => handleTabChange('members')}
                    className={`px-4 py-2 rounded lg:text-sm text-xs transition-all border ${currentTab === 'members' ? 'bg-blue-500 dark:bg-gray-600 text-white dark:text-white dark:border-gray-800 ' : 'text-gray-500 bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}>
                    <LocSpan textKey={"institutionDataPage.members"} />
                </button>
                <button
                    onClick={() => handleTabChange('courses')}
                    className={`px-4 py-2 rounded lg:text-sm text-xs transition-all border ${currentTab === 'courses' ? 'bg-blue-500 dark:bg-gray-600 text-white dark:text-white dark:border-gray-800 ' : 'text-gray-500 bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}>
                    <LocSpan textKey={"institutionDataPage.courses"} />
                </button>
                <button
                    onClick={() => handleTabChange('resources')}
                    className={`px-4 py-2 rounded lg:text-sm text-xs transition-all border ${currentTab === 'resources' ? 'bg-blue-500 dark:bg-gray-600 text-white dark:text-white dark:border-gray-800 ' : 'text-gray-500 bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}>
                    <LocSpan textKey={"institutionDataPage.resources"} />
                </button>
                <button
                    onClick={() => handleTabChange('profile')}
                    className={`px-4 py-2 rounded lg:text-sm text-xs transition-all border ${currentTab === 'profile' ? 'bg-blue-500 dark:bg-gray-600 text-white dark:text-white dark:border-gray-800 ' : 'text-gray-500 bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}>
                    <LocSpan textKey={"institutionDataPage.profile"} />
                </button>
            </div>

            <div className="w-full max-w-4xl flex flex-col gap-6 text-left pb-24">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default InstitutionDataPage;