import React from 'react';
import { FaUser, FaChalkboardTeacher, FaBook, FaFolder } from 'react-icons/fa'; 
import { StudyGroupData } from '../../../data/Institutions/StudyGroupData.ts';
import {Link, useParams} from "react-router-dom";
import Container from "../../../components/ui/containers/Container.tsx";
import DeleteButton from "../../../components/DeleteButton.tsx";
import { CollectionTypes } from "../../../data/CollectionTypes.tsx";
import RoundedTag from "../../../components/ui/text/RoundedTag.tsx";

interface StudyGroupDataElementProps {
    studyGroup: StudyGroupData;
}

const StudyGroupDataElement: React.FC<StudyGroupDataElementProps> = ({ studyGroup }) => {
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

                <div className="absolute top-2 right-2">
                    <DeleteButton
                        creatorId={studyGroup.creatorId}
                        elementId={studyGroup._id}
                        elementType={CollectionTypes.StudyGroup}
                        deleteRelations={true}
                    />
                </div>
                
                <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                        {studyGroup.name || 'Study Group Name'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {studyGroup.description || 'Study Group Description'}
                    </p>

                    <div className="flex items-center justify-between mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center">
                                <FaUser className="mr-1"/>
                                <span>{studyGroup.memberIds?.length}</span>
                                <span className="hidden sm:inline">Members</span>
                            </span>
                            <span className="flex items-center">
                                <FaChalkboardTeacher className="mr-1"/>
                                <span>{studyGroup.memberIds?.length}</span>
                                <span className="hidden sm:inline">Teachers</span>
                            </span>
                            <span className="flex items-center">
                                <FaBook className="mr-1"/>
                                <span>{studyGroup.courseIds?.length}</span>
                                <span className="hidden sm:inline">Courses</span>
                            </span>
                            <span className="flex items-center">
                                <FaFolder className="mr-1"/>
                                <span>{studyGroup.resourcesIds?.length}</span>
                                <span className="hidden sm:inline">Resources</span>
                            </span>
                        </div>

                    </div>
                </div>
            </Container>
        </Link>

    );
};

export default StudyGroupDataElement;