import React from 'react';
import { FaUser, FaBook, FaFolder } from 'react-icons/fa'; 
import { StudyGroupData } from '../../../data/Institutions/StudyGroupData.ts';
import {Link, useParams} from "react-router-dom";
import Container from "../../../components/ui/containers/Container.tsx";
import DeleteButton from "../../../components/DeleteButton.tsx";
import { CollectionTypes } from "../../../data/CollectionTypes.tsx";
import RoundedTag from "../../../components/ui/text/RoundedTag.tsx";
import LocSpan from "../../../components/LocSpan.tsx";

interface StudyGroupDataElementProps {
    studyGroup: StudyGroupData;
    canDelete?: boolean
    onDelete?: (elementId: string, collectionType: CollectionTypes) => void;
}

const StudyGroupDataElement: React.FC<StudyGroupDataElementProps> = ({ studyGroup, canDelete = false, onDelete }) => {
    const { institutionId } = useParams<{ institutionId: string }>();

    return (
        <Link
            to={institutionId
                ? `/institution/${studyGroup.institutionId}/studyGroup/${studyGroup._id}`
                : `/studyGroup/${studyGroup._id}`
            }
        >
            <Container className="w-full max-w-4xl my-2">
                {!studyGroup.isActive && (<RoundedTag textKey={"archived"} className={"right-10 top-2 absolute"}/>)}

                {canDelete && 
                <div className="absolute top-2 right-2">
                    <DeleteButton
                        creatorId={studyGroup.creatorId}
                        elementId={studyGroup._id}
                        elementType={CollectionTypes.StudyGroup}
                        deleteRelations={true}
                        onDelete={onDelete}
                    />
                </div>}
                
                <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                        {studyGroup.name || 'Study Group Name'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {studyGroup.description || 'Study Group Description'}
                    </p>

                    <div className="flex items-center justify-between mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-0.5">
                                <FaUser className="mr-1"/>
                                <span>{studyGroup.memberIds?.length}</span>
                                <LocSpan textKey={'members'} className="hidden sm:inline" />
                            </span>
                            <span className="flex items-center gap-0.5">
                                <FaBook className="mr-1"/>
                                <span>{studyGroup.courseIds?.length}</span>
                                <LocSpan textKey={'courses'} className="hidden sm:inline" />
                            </span>
                            <span className="flex items-center gap-0.5">
                                <FaFolder className="mr-1"/>
                                <span>{studyGroup.resourcesIds?.length}</span>
                                <LocSpan textKey={'resources'} className="hidden sm:inline" />
                            </span>
                        </div>

                    </div>
                </div>
            </Container>
        </Link>

    );
};

export default StudyGroupDataElement;