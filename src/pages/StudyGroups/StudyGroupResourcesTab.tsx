import React, { useEffect, useState } from 'react';
import { StudyGroupData } from '../../data/Institutions/StudyGroupData';
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import { FaPlus } from "react-icons/fa";
import PaginatedContainer from "../../components/ui/containers/PaginatedContainer.tsx";
import NoDataMessage from "../../components/NoDataMessage.tsx";
import LoadingScreen from "../../components/LoadingScreen.tsx";
import ResourceGroupComponent from "../Institutions/Components/ResourceGroupComponent.tsx";
import AddResourcesGroupToStudyGroupModal from "../Institutions/AddResourcesGroupToStudyGroupModal.tsx";
import {useStudyGroupResources} from "../../hooks/newHooks/Resources/useStudyGroupResources.ts";

interface StudyGroupResourcesTabProps {
    studyGroup: StudyGroupData;
    canEdit: boolean;
}

const StudyGroupResourcesTab: React.FC<StudyGroupResourcesTabProps> = ({ studyGroup, canEdit }) => {
    const [page, setPage] = useState<number>(1);
    const [isAddResourcesModalOpen, setIsAddResourcesModalOpen] = useState(false);

    const { data: resourcesData, isLoading: resourcesLoading, fetchStudyGroupResources } = useStudyGroupResources(
        studyGroup.resourcesIds || [],
        page,
        10
    );

    useEffect(() => {
        fetchStudyGroupResources();
    }, [fetchStudyGroupResources]); 

    return (
        <div>
            <LoadingScreen isLoading={resourcesLoading} />

            {canEdit && (
                <PrimaryButton
                    label="Add Resources"
                    iconComponent={<FaPlus />}
                    onClick={() => setIsAddResourcesModalOpen(true)}
                    className="w-40 text-xs"
                />
            )}

            {resourcesData && resourcesData.documents.length > 0 ? (
                <PaginatedContainer
                    documents={resourcesData.documents}
                    currentPage={page}
                    totalPages={resourcesData.totalPages}
                    onPageChange={setPage}
                    RenderComponent={({ document }) => (
                        <ResourceGroupComponent
                            key={document._id}
                            resourceGroup={document}
                            canDelete={false}
                            onDelete={() => {}}
                            institutionId={document.institutionId}
                            isEditable={false}
                            onAdd={() => {}}
                        />
                    )}
                />
            ) : (
                <NoDataMessage />
            )}
            
            {isAddResourcesModalOpen && (
                <AddResourcesGroupToStudyGroupModal
                    onClose={() => setIsAddResourcesModalOpen(false)}
                    studyGroupId={studyGroup._id || ''}
                    onAddGroupsSuccess={() => {
                        setIsAddResourcesModalOpen(false);
                        fetchStudyGroupResources();
                    }}
                />
            )}
        </div>
    );
};

export default StudyGroupResourcesTab;