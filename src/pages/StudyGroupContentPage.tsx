import React, { useEffect, useRef, useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { useParams } from "react-router-dom";
import { FaBook, FaCalendar, FaChalkboardTeacher, FaCog, FaFolder, FaPenAlt, FaSchool, FaUser } from "react-icons/fa";
import { useStudyGroup } from '../hooks/useGetStudyGroup.tsx';
import { useInstitutionById } from '../hooks/institutionHooks/useInstitutionById.ts';
import Tabs from "../components/ui/toggles/Tabs.tsx";
import Editable from "../components/ui/text/Editable";
import { CollectionTypes } from "../data/CollectionTypes.tsx";
import LocSpan from "../components/LocSpan";
import RoundedTag from "../components/ui/text/RoundedTag.tsx";
import { MembershipRole, MembershipData } from "../data/MembershipData.ts";
import { useAuth } from '../context/AuthContext';
import NoDataMessage from "../components/NoDataMessage.tsx";
import { FaMessage } from "react-icons/fa6";
import StudyGroupCoursesTab from "./StudyGroups/StudyGroupCoursesTab.tsx";
import StudyGroupMembersTab from "./StudyGroups/StudyGroupMembersTab.tsx";
import StudyGroupChatTab from "./StudyGroups/StudyGroupChatTab.tsx";
import StudyGroupSchedule from "./StudyGroups/StudyGroupScheduleTab.tsx";
import StudyGroupSettingsTab from "./StudyGroups/StudyGroupSettingsTab.tsx";
import StudyGroupResourcesTab from "./StudyGroups/StudyGroupResourcesTab.tsx";
import {useElements} from "../hooks/newHooks/useElements.ts";
import {useUserInfo} from "../hooks/newHooks/Courses/useUserInfo.ts";

const StudyGroupContentPage: React.FC = () => {
    const { studyGroupId } = useParams<{ studyGroupId: string }>();
    const [currentTab, setCurrentTab] = useState<string>('courses');
    const [role, setRole] = useState<MembershipRole>(MembershipRole.None);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data: studyGroup, isLoading, fetchStudyGroup } = useStudyGroup(studyGroupId || '');
    const { data: institution, fetchInstitution } = useInstitutionById(studyGroup?.institutionId || '');

    const { getRole, memberships } = useAuth();

    const { data: memberData, isLoading: membersLoading, fetchElementsData } = useElements<MembershipData>(
        studyGroup?.memberIds || [],
        CollectionTypes.Membership
    );

    const senseiUserIds = Object.values(memberData || {})
        .filter((member) => ['owner', 'sensei', 'staff'].includes(member.role))
        .map((member) => member.userId);

    const { data: userInfo, isLoading: usersLoading, fetchUserInfo } = useUserInfo(senseiUserIds);

    useEffect(() => {
        fetchStudyGroup();
    }, [fetchStudyGroup]);

    useEffect(() => {
        fetchInstitution();
    }, [fetchInstitution]);

    useEffect(() => {
        fetchElementsData();
    }, [studyGroup?.memberIds]);

    useEffect(() => {
        fetchUserInfo();
    }, [memberData]);

    useEffect(() => {
        const savedTab = localStorage.getItem('currentStudyGroupTab');
        if (savedTab) {
            setCurrentTab(savedTab as 'courses' | 'resources' | 'members' | 'schedule' | 'chat' | 'settings' | 'homework');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('currentStudyGroupTab', currentTab);
    }, [currentTab]);

    useEffect(() => {
        const fetchRole = async () => {
            if (studyGroup?.institutionId) {
                const fetchedRole = await getRole(studyGroup.institutionId, '');
                setRole(fetchedRole);
            }
        };
        if (studyGroup) {
            fetchRole();
        }
    }, [studyGroup, memberships, getRole]);

    const handleTabChange = (view: string) => {
        setCurrentTab(view);
    };

    const canEdit = role === MembershipRole.Owner || role === MembershipRole.Staff || role === MembershipRole.Sensei;

    const defaultTabs = [
        { label: 'courses', view: 'courses', icon: <FaBook /> },
        { label: 'resources', view: 'resources', icon: <FaFolder /> },
        { label: 'members', view: 'members', icon: <FaUser /> },
    ];

    const enabledTabs = studyGroup?.viewsEnabled || [];

    const tabs = [
        ...(enabledTabs.includes('schedule') ? [{ label: 'schedule', view: 'schedule', icon: <FaCalendar /> }] : []),
        ...(enabledTabs.includes('chat') ? [{ label: 'chat', view: 'chat', icon: <FaMessage /> }] : []),
        ...(enabledTabs.includes('homework') ? [{ label: 'homework', view: 'homework', icon: <FaPenAlt /> }] : []),
        ...defaultTabs,
        ...(canEdit ? [{ label: 'settings', view: 'settings', icon: <FaCog /> }] : []),
    ];

    const renderTabContent = () => {
        if (!studyGroup) {
            return (<div><NoDataMessage /></div>);
        }
        switch (currentTab) {
            case 'courses':
                return <StudyGroupCoursesTab studyGroup={studyGroup} canEdit={canEdit} />;
            case 'members':
                return <StudyGroupMembersTab studyGroup={studyGroup} canEdit={canEdit} role={role} />;
            case 'chat':
                return <StudyGroupChatTab studyGroup={studyGroup} canEdit={canEdit} role={role} />;
            case 'schedule':
                return <StudyGroupSchedule studyGroup={studyGroup} canEdit={canEdit} />;
            case 'settings':
                return <StudyGroupSettingsTab studyGroup={studyGroup} canEdit={canEdit} />;
            case 'resources':
                return <StudyGroupResourcesTab studyGroup={studyGroup} canEdit={canEdit} />;
            default:
                return (<div><NoDataMessage /></div>);
        }
    };

    return (
        <div ref={scrollContainerRef} className="flex-1 flex flex-col items-center justify-start h-full w-full fixed">
            <LoadingScreen isLoading={isLoading || membersLoading || usersLoading} />
            {studyGroup && (
                <div className="lg:pl-0 pl-16 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-4xl mt-8 lg:mb-2 px-4">
                    <div className="flex flex-col items-start mb-4 sm:mb-0 w-full">

                        <div className={"flex justify-end w-full"}>
                            {!studyGroup.isActive && (<RoundedTag textKey={"archived"} />)}
                        </div>

                        <Editable
                            initialValue={studyGroup.name}
                            collection={CollectionTypes.StudyGroup}
                            documentId={studyGroupId || ''}
                            field="name"
                            className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 capitalize"
                            canEdit={canEdit}
                            maxChar={40}
                        />
                        <Editable
                            initialValue={studyGroup.description}
                            collection={CollectionTypes.StudyGroup}
                            documentId={studyGroupId || ''}
                            field="description"
                            className="text-gray-600 dark:text-gray-400 mt-2"
                            canEdit={canEdit}
                            maxChar={400}
                        />

                        {senseiUserIds.length > 0 && (
                            <p className="inline-flex text-xs text-gray-500 gap-2">
                                <FaChalkboardTeacher />
                                <LocSpan textKey={'professors'} />: {senseiUserIds.map(userId => userInfo?.[userId]?.name).join(', ')}
                            </p>
                        )}

                        <a
                            className="inline-flex text-xs text-gray-500 mb-2 gap-2 hover:underline"
                            href={`/institution/${studyGroup.institutionId}`}
                        >
                            <FaSchool />
                            {institution?.name}
                        </a>
                    </div>
                </div>
            )}

            <div className="flex gap-2 mb-4">
                <Tabs tabs={tabs} onTabChange={handleTabChange} currentTab={currentTab} />
            </div>

            <div className="w-full max-w-4xl flex flex-grow flex-col gap-6 text-left pb-24 text-white">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default StudyGroupContentPage;