import React, { useEffect, useRef, useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { useParams } from "react-router-dom";
import { FaBook, FaChalkboardTeacher, FaFolder, FaPlus, FaSchool, FaUser } from "react-icons/fa";
import { useStudyGroupById } from '../hooks/useGetStudyGroup.tsx';
import { useInstitutionById } from '../hooks/institutionHooks/useInstitutionById.ts';
import BindCoursesModal from './StudyGroups/BindCoursesModal';
import BindMembersModal from "./StudyGroups/BindMembersModal.tsx";
import PrimaryButton from "../components/ui/buttons/PrimaryButton.tsx";
import Tabs from "../components/ui/toggles/Tabs.tsx";
import Editable from "../components/ui/text/Editable";
import { CollectionTypes } from "../data/CollectionTypes.tsx";
import StudyGroupMemberElement from "../components/StudyGroupMemberElement.tsx";
import LocSpan from "../components/LocSpan";
import SelectionToggle from "../components/ui/toggles/SelectionToggle.tsx";
import { useUpdateDocument } from '../hooks/updateHooks/useUpdateDocument';
import RoundedTag from "../components/ui/text/RoundedTag.tsx";
import { MembershipRole } from "../data/MembershipData.ts";
import { useAuth } from '../context/AuthContext';
import { useStudyMembers } from '../hooks/newHooks/Memberships/useStudyMembers'; // Importa el hook
import PaginatedContainer from '../components/ui/containers/PaginatedContainer'; // Importa el componente de paginación

const StudyGroupContentPage: React.FC = () => {
    const { studyGroupId } = useParams<{ studyGroupId: string }>();
    const [currentTab, setCurrentTab] = useState<string>('courses');
    const [isBindCoursesModalOpen, setIsBindCoursesModalOpen] = useState(false);
    const [isBindMembersModalOpen, setIsBindMembersModalOpen] = useState(false);
    const [isArchived, setIsArchived] = useState<boolean>(false);
    const [role, setRole] = useState<MembershipRole>(MembershipRole.None);
    const [page, setPage] = useState<number>(1); // Estado para la página de miembros
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data: studyGroup, error, isLoading } = useStudyGroupById(studyGroupId || '');
    const { data: institution } = useInstitutionById(studyGroup?.institutionId || '');

    const { data: membersData, isLoading: membersLoading, fetchStudyMembers } = useStudyMembers(
        studyGroup?.memberIds || [],
        page,
        10
    );

    const { mutate: updateDocument } = useUpdateDocument<Partial<{ isActive: boolean }>>();
    const { getRole } = useAuth();

    useEffect(() => {
        setIsArchived(!(studyGroup?.isActive ?? false));
    }, [studyGroup]);
    
    useEffect(() => {
        fetchStudyMembers();
        console.log(studyGroup?.memberIds)
    }, [currentTab]);

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
            console.error('Error loading study group:', error);
        }
    }, [error]);

    useEffect(() => {
        const fetchRole = async () => {
            if (studyGroup?.institutionId) {
                const fetchedRole = await getRole(studyGroup.institutionId, '');
                console.log(fetchedRole);
                setRole(fetchedRole);
            }
        };

        if (studyGroup) {
            fetchRole();
        }
    }, [studyGroup, getRole]);

    const handleTabChange = (view: string) => {
        setCurrentTab(view);
    };

    const handleBindCoursesSuccess = () => {
        setIsBindCoursesModalOpen(false);
        window.location.reload();
    };

    const handleBindMembersSuccess = () => {
        setIsBindMembersModalOpen(false);
        window.location.reload();
    };

    const handleToggleArchive = () => {
        if (!isArchived) {
            const confirmArchive = window.confirm(
                'You are going to archive this Course. Assigned Students will still be able to access to it. Do you want to continue?'
            );
            if (!confirmArchive) return;
        }

        setIsArchived(!isArchived);

        updateDocument({
            collection: CollectionTypes.StudyGroup,
            documentId: studyGroupId || '',
            updateData: { isActive: isArchived },
        });
    };

    const canEdit = role === MembershipRole.Owner || role === MembershipRole.Staff || role === MembershipRole.Sensei;

    const tabs = [
        { label: 'institutionPage.courses', view: 'courses', icon: <FaBook /> },
        { label: 'institutionPage.resources', view: 'resources', icon: <FaFolder /> },
        { label: 'institutionPage.members', view: 'members', icon: <FaUser /> },
    ];

    const senseis = studyGroup?.memberIds?.filter((member: any) => member.role === 'sensei') || [];

    return (
        <div ref={scrollContainerRef} className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            <LoadingScreen isLoading={isLoading || membersLoading} />
            {studyGroup && (
                <div className="lg:pl-0 pl-16 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-4xl mt-8 lg:mb-2 px-4">
                    <div className="flex flex-col items-start mb-4 sm:mb-0 w-full">

                        <div className={"flex justify-end w-full"} >

                            {!studyGroup.isActive && (<RoundedTag textKey={"archived"} />)}

                            {(role === MembershipRole.Staff || role === MembershipRole.Owner) &&
                                <SelectionToggle
                                    isSelected={isArchived}
                                    onToggle={handleToggleArchive}
                                    textKey={"Archive"}
                                />}
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

                        {senseis.length > 0 && (
                            <p className="inline-flex text-xs text-gray-500 gap-2">
                                <FaChalkboardTeacher />
                                <LocSpan textKey={'professors'} />: {senseis.map((sensei: any) => sensei.userId?.name).join(', ')}
                            </p>
                        )}

                        <p className="inline-flex text-xs text-gray-500 mb-2 gap-2">
                            <FaSchool />
                            {institution?.name}
                        </p>
                    </div>
                </div>
            )}

            <div className="flex gap-2 mb-4">
                <Tabs tabs={tabs} onTabChange={handleTabChange} currentTab={currentTab} />
            </div>

            <div className="w-full max-w-4xl flex flex-col gap-6 text-left pb-24 text-white">
                {currentTab === 'courses' && (
                    <div>
                        {canEdit &&
                            <PrimaryButton label={'bindCourses'} iconComponent={<FaPlus />} onClick={() => setIsBindCoursesModalOpen(true)} className={'w-40 text-xs mb-2'} />
                        }

                    </div>
                )}

                {currentTab === 'resources' && (
                    <div>
                        <p>No resources available</p>
                    </div>
                )}

                {currentTab === 'members' && (
                    <div>
                        {canEdit &&
                            <PrimaryButton label={'addMembers'} iconComponent={<FaPlus />} onClick={() => setIsBindMembersModalOpen(true)} className={'w-40 text-xs'} />
                        }

                        {/* PaginatedContainer para mostrar los miembros */}
                        {membersData && membersData.documents.length > 0 ? (
                            <PaginatedContainer
                                documents={membersData.documents}
                                currentPage={page}
                                totalPages={membersData.totalPages}
                                onPageChange={setPage}
                                RenderComponent={({ document }) => (
                                    <StudyGroupMemberElement member={document} studyGroupId={studyGroupId || ''} viewerRole={role} />
                                )}
                            />
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
                    studyGroupId={studyGroupId || ''}
                    institutionId={studyGroup?.institutionId || ''}
                    onSaveSuccess={handleBindCoursesSuccess}
                />
            )}

            {isBindMembersModalOpen && (
                <BindMembersModal
                    onClose={() => setIsBindMembersModalOpen(false)}
                    studyGroupId={studyGroupId || ''}
                    institutionId={studyGroup?.institutionId || ''}
                    onSaveSuccess={handleBindMembersSuccess}
                />
            )}
        </div>
    );
};

export default StudyGroupContentPage;