import React, { useState, useRef, useEffect } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import LocSpan from "../../components/LocSpan.tsx";
import { useParams } from "react-router-dom";
import { FaFolder, FaUser, FaBook } from "react-icons/fa";
import { useStudyGroupById } from '../../hooks/useGetStudyGroup.tsx';

const StudyGroupContentPage: React.FC = () => {
    const { studyGroupId } = useParams<{ studyGroupId: string; }>();
    const [currentTab, setCurrentTab] = useState<'courses' | 'resources' | 'members'>('courses');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data: studyGroup, error, isLoading } = useStudyGroupById(studyGroupId || '');

    useEffect(() => {
        if (error) {
            console.error("Error loading study group:", error);
        }
    }, [error]);

    const handleTabChange = (tab: 'courses' | 'resources' | 'members') => {
        setCurrentTab(tab);
    };

    return (
        <div ref={scrollContainerRef} className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            <LoadingScreen isLoading={isLoading} />

            {studyGroup && (
                <div className="lg:pl-0 pl-16 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-4xl mt-8 lg:mb-2 px-4">
                    <div className="flex flex-col items-start mb-4 sm:mb-0">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 capitalize">
                            {studyGroup.name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">{studyGroup.description}</p>
                        <p className="text-gray-500 dark:text-gray-500 mt-1 text-sm">
                            Created by: {studyGroup.creatorId?.name || 'Unknown'}
                        </p>
                    </div>
                </div>
            )}

            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => handleTabChange('courses')}
                    className={`flex items-center gap-2 px-4 py-2 rounded lg:text-sm text-xs transition-all border ${currentTab === 'courses' ? 'bg-blue-500 dark:bg-gray-600 text-white dark:text-white dark:border-gray-800 ' : 'text-gray-500 bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}
                >
                    <FaBook className="mr-1" />
                    <LocSpan textKey={"institutionPage.courses"} />
                </button>
                <button
                    onClick={() => handleTabChange('resources')}
                    className={`flex items-center gap-2 px-4 py-2 rounded lg:text-sm text-xs transition-all border ${currentTab === 'resources' ? 'bg-blue-500 dark:bg-gray-600 text-white dark:text-white dark:border-gray-800 ' : 'text-gray-500 bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}
                >
                    <FaFolder className="mr-1" />
                    <LocSpan textKey={"institutionPage.resources"} />
                </button>
                <button
                    onClick={() => handleTabChange('members')}
                    className={`flex items-center gap-2 px-4 py-2 rounded lg:text-sm text-xs transition-all border ${currentTab === 'members' ? 'bg-blue-500 dark:bg-gray-600 text-white dark:text-white dark:border-gray-800 ' : 'text-gray-500 bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}
                >
                    <FaUser className="mr-1" />
                    <LocSpan textKey={"institutionPage.members"} />
                </button>
            </div>

            <div className="w-full max-w-4xl flex flex-col gap-6 text-left pb-24 text-white">
                {currentTab === 'courses' && (
                    <div>
                        <h2 className="text-lg font-bold">Courses</h2>
                        {studyGroup?.courseIds?.length > 0 ? (
                            studyGroup.courseIds.map((course) => (
                                <div key={course._id}>
                                    <p>{course.name}</p>
                                    <p>Created by: {course.creatorId?.name || 'Unknown'}</p>
                                    <p>Lessons: {course.lessons?.length || 0}</p>
                                </div>
                            ))
                        ) : (
                            <p>No courses available</p>
                        )}
                    </div>
                )}

                {currentTab === 'resources' && (
                    <div>
                        <h2 className="text-lg font-bold">Resources</h2>
                        <p>No resources available</p>
                    </div>
                )}

                {currentTab === 'members' && (
                    <div>
                        <h2 className="text-lg font-bold">Members</h2>
                        {studyGroup?.memberIds?.length > 0 ? (
                            studyGroup.memberIds.map((member) => (
                                <div key={member._id}>
                                    <p>{member.userId?.name || member.email}</p>
                                    <p>Role: {member.role}</p>
                                </div>
                            ))
                        ) : (
                            <p>No members available</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyGroupContentPage;