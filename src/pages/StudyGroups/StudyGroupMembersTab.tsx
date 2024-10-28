import React, {useEffect, useState} from 'react';
import { StudyGroupData } from '../../data/Institutions/StudyGroupData';
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import {FaPlus} from "react-icons/fa";
import PaginatedContainer from "../../components/ui/containers/PaginatedContainer.tsx";
import NoDataMessage from "../../components/NoDataMessage.tsx";
import LoadingScreen from "../../components/LoadingScreen.tsx";
import StudyGroupMemberElement from "../../components/StudyGroupMemberElement.tsx";
import BindMembersModal from "./BindMembersModal.tsx";
import {useStudyMembers} from "../../hooks/newHooks/Memberships/useStudyMembers.ts";
import {MembershipRole} from "../../data/MembershipData.ts";

interface StudyGroupMembersTabProps {
    studyGroup: StudyGroupData;
    canEdit: boolean;
    role: MembershipRole;
}

const StudyGroupMembersTab: React.FC<StudyGroupMembersTabProps> = ({ studyGroup, canEdit, role }) => {
    const [page, setPage] = useState<number>(1);
    const [isBindMembersModalOpen, setIsBindMembersModalOpen] = useState(false);

    const { data: membersData, isLoading: membersLoading, fetchStudyMembers } = useStudyMembers(studyGroup?.memberIds || [], page, 10);
    
    useEffect(() => {
        fetchStudyMembers();
    }, [fetchStudyMembers]);


    return (
        <div>
            <LoadingScreen isLoading={membersLoading} />

            {canEdit &&
                <PrimaryButton label={'addMembers'} iconComponent={<FaPlus/>}
                               onClick={() => setIsBindMembersModalOpen(true)} className={'w-40 text-xs'}/>
            }

            {membersData && membersData.documents.length > 0 ? (
                <PaginatedContainer
                    documents={membersData.documents}
                    currentPage={page}
                    totalPages={membersData.totalPages}
                    onPageChange={setPage}
                    RenderComponent={({document}) => (
                        <StudyGroupMemberElement member={document} studyGroupId={studyGroup._id} viewerRole={role}/>
                    )}
                />
            ) : (
                <NoDataMessage/>
            )}

            {isBindMembersModalOpen && (
                <BindMembersModal
                    onClose={() => setIsBindMembersModalOpen(false)}
                    studyGroupId={studyGroup._id || ''}
                    institutionId={studyGroup?.institutionId || ''}
                    onSaveSuccess={() => setIsBindMembersModalOpen(false)}
                />
            )}
        </div>
    );
};

export default StudyGroupMembersTab;