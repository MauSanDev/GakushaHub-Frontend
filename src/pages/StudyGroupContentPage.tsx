import React, { useState, useRef, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { useParams } from "react-router-dom";
import {FaFolder, FaUser, FaBook, FaPlus} from "react-icons/fa";
import { useStudyGroupById } from '../hooks/useGetStudyGroup.tsx';
import BindCoursesModal from './StudyGroups/BindCoursesModal';
import CourseDataElement from "../components/CourseDataElement.tsx";
import { Link } from "react-router-dom";
import BindMembersModal from "./StudyGroups/BindMembersModal.tsx";
import InstitutionMemberElement from "./Institutions/Components/InstitutionMemberElement.tsx";
import CreatorLabel from "../components/ui/text/CreatorLabel.tsx";
import TabToggle from '../components/ui/toggles/TabToggle.tsx';
import PrimaryButton from "../components/ui/buttons/PrimaryButton.tsx";

const StudyGroupContentPage: React.FC = () => {
    const { studyGroupId, institutionId } = useParams<{ studyGroupId: string; institutionId: string }>();
    const [currentTab, setCurrentTab] = useState<'courses' | 'resources' | 'members'>('courses');
    const [isBindCoursesModalOpen, setIsBindCoursesModalOpen] = useState(false);
    const [isBindMembersModalOpen, setIsBindMembersModalOpen] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data: studyGroup, error, isLoading } = useStudyGroupById(studyGroupId || '');

    useEffect(() => {
        const savedTab = localStorage.getItem('currentStudyGroupTab');
        if (savedTab) {
            setCurrentTab(savedTab as 'courses' | 'resources' | 'members');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('currentStudyGroupTab', currentTab);
    }, [currentTab]);

    useEffect(() => {
        if (error) {
            console.error("Error loading study group:", error);
        }
    }, [error]);

    const handleTabChange = (tab: 'courses' | 'resources' | 'members') => {
        setCurrentTab(tab);
    };

    const handleBindCoursesSuccess = () => {
        setIsBindCoursesModalOpen(false);
        window.location.reload();
    };

    const handleBindMembersSuccess = () => {
        setIsBindMembersModalOpen(false);
        window.location.reload();
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
                        <CreatorLabel name={studyGroup.creatorId?.name || 'Unknown'} />
                    </div>
                </div>
            )}

            <div className="flex gap-2 mb-4">
                <TabToggle
                    isSelected={currentTab === 'courses'}
                    onToggle={() => handleTabChange('courses')}
                    onSelected={{
                        text: 'institutionPage.courses',
                        icon: <FaBook className="mr-1" />,
                        className: 'bg-blue-500 dark:bg-gray-600 text-white dark:border-gray-800',
                    }}
                    onDeselected={{
                        text: 'institutionPage.courses',
                        icon: <FaBook className="mr-1" />,
                        className: 'text-gray-500 bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
                    }}
                />
                <TabToggle
                    isSelected={currentTab === 'resources'}
                    onToggle={() => handleTabChange('resources')}
                    onSelected={{
                        text: 'institutionPage.resources',
                        icon: <FaFolder className="mr-1" />,
                        className: 'bg-blue-500 dark:bg-gray-600 text-white dark:border-gray-800',
                    }}
                    onDeselected={{
                        text: 'institutionPage.resources',
                        icon: <FaFolder className="mr-1" />,
                        className: 'text-gray-500 bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
                    }}
                />
                <TabToggle
                    isSelected={currentTab === 'members'}
                    onToggle={() => handleTabChange('members')}
                    onSelected={{
                        text: 'institutionPage.members',
                        icon: <FaUser className="mr-1" />,
                        className: 'bg-blue-500 dark:bg-gray-600 text-white dark:border-gray-800',
                    }}
                    onDeselected={{
                        text: 'institutionPage.members',
                        icon: <FaUser className="mr-1" />,
                        className: 'text-gray-500 bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
                    }}
                />
            </div>

            <div className="w-full max-w-4xl flex flex-col gap-6 text-left pb-24 text-white">
                {currentTab === 'courses' && (
                    <div>
                        <h2 className="text-lg font-bold">Courses</h2>
                        
                        <PrimaryButton label={"bindCourses"} iconComponent={<FaPlus />} onClick={() => setIsBindCoursesModalOpen(true)} className={"w-40 text-xs mb-2"} />
                        
                        {studyGroup?.courseIds?.length > 0 ? (
                            studyGroup.courseIds.map((course) => (
                                <Link key={course.name} to={`/courses/${course._id}`} className="page-fade-enter page-fade-enter-active">
                                    <CourseDataElement course={course} key={course.name}/>
                                </Link>
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
                        <PrimaryButton label={"addMembers"} iconComponent={<FaPlus />} onClick={() => setIsBindCoursesModalOpen(true)} className={"w-40 text-xs"} />

                        {studyGroup?.memberIds?.length > 0 ? (
                            studyGroup.memberIds.map((member) => (
                                <InstitutionMemberElement member={member} key={member.name} />
                            ))
                        ) : (
                            <p>No members available</p>
                        )}
                    </div>
                )}
            </div>

            {/* Bind Courses Modal */}
            {isBindCoursesModalOpen && (
                <BindCoursesModal
                    onClose={() => setIsBindCoursesModalOpen(false)}
                    studyGroupId={studyGroupId || ""}
                    institutionId={institutionId || ""}
                    onSaveSuccess={handleBindCoursesSuccess}
                />
            )}

            {/* Bind Members Modal */}
            {isBindMembersModalOpen && (
                <BindMembersModal
                    onClose={() => setIsBindMembersModalOpen(false)}
                    studyGroupId={studyGroupId || ""}
                    institutionId={institutionId || ""}
                    onSaveSuccess={handleBindMembersSuccess}
                />
            )}
        </div>
    );
};

export default StudyGroupContentPage;