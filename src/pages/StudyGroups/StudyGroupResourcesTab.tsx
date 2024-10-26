import React, { useEffect, useState } from 'react';
import { StudyGroupData } from '../../data/Institutions/StudyGroupData';
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import { FaPlus } from "react-icons/fa";
import PaginatedContainer from "../../components/ui/containers/PaginatedContainer.tsx";
import NoDataMessage from "../../components/NoDataMessage.tsx";
import LoadingScreen from "../../components/LoadingScreen.tsx";
import ResourceGroupComponent from "../Institutions/Components/ResourceGroupComponent.tsx";
import AddResourcesGroupToStudyGroupModal from "../Institutions/AddResourcesGroupToStudyGroupModal.tsx";
import { useStudyGroupResources } from "../../hooks/newHooks/Resources/useStudyGroupResources.ts";
import { useUpdateList } from "../../hooks/updateHooks/useUpdateList.ts";
import { CollectionTypes } from "../../data/CollectionTypes.tsx";

interface StudyGroupResourcesTabProps {
    studyGroup: StudyGroupData;
    canEdit: boolean;
}

const StudyGroupResourcesTab: React.FC<StudyGroupResourcesTabProps> = ({ studyGroup, canEdit }) => {
    const [page, setPage] = useState<number>(1);
    const [isAddResourcesModalOpen, setIsAddResourcesModalOpen] = useState(false);

    // Hook para obtener y gestionar los recursos del grupo de estudio
    const { data: resourcesData, isLoading: resourcesLoading, fetchStudyGroupResources } = useStudyGroupResources(
        studyGroup.resourcesIds || [],
        page,
        10
    );

    // Hook para actualizar la lista de recursos asociados al grupo de estudio
    const { mutate: updateList } = useUpdateList();

    // Cargar recursos al montar y cuando cambie el hook
    useEffect(() => {
        fetchStudyGroupResources();
    }, [fetchStudyGroupResources]);

    // Manejo de eliminación de recurso
    const handleDeleteResource = (resourceId: string) => {
        updateList({
            collection: CollectionTypes.StudyGroup,
            documentId: studyGroup._id,
            field: "resourcesIds",
            value: [resourceId],
            action: "remove",
        }, {
            onSuccess: () => {
                fetchStudyGroupResources();
            }
        });
    };

    return (
        <div>
            <LoadingScreen isLoading={resourcesLoading} />

            {canEdit && (
                <PrimaryButton
                    label="resourcesKeys.addResources"
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
                            canDelete={canEdit}
                            onDelete={() => handleDeleteResource(document._id)}
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