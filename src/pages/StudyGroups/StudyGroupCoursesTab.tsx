import React, {useEffect, useState} from 'react';
import { Link } from "react-router-dom";
import { StudyGroupData } from '../../data/Institutions/StudyGroupData'; 
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import {FaPlus} from "react-icons/fa";
import PaginatedContainer from "../../components/ui/containers/PaginatedContainer.tsx";
import StudyGroupCourseDataElement from "../../components/StudyGroupCourseDataElement.tsx";
import NoDataMessage from "../../components/NoDataMessage.tsx";
import {useStudyGroupCourses} from "../../hooks/newHooks/Courses/useStudyGroupCourses.ts";
import BindCoursesModal from "./BindCoursesModal.tsx";
import LoadingScreen from "../../components/LoadingScreen.tsx"; 

interface StudyGroupCoursesTabProps {
    studyGroup: StudyGroupData;  
    canEdit: boolean;
}

const StudyGroupCoursesTab: React.FC<StudyGroupCoursesTabProps> = ({ studyGroup, canEdit }) => {
    const [page, setPage] = useState<number>(1);
    const [isBindCoursesModalOpen, setIsBindCoursesModalOpen] = useState(false);

    const { data: coursesData, isLoading: coursesLoading, fetchStudyCourses } = useStudyGroupCourses(studyGroup?.courseIds || [], page, 10);

    useEffect(() => {
        fetchStudyCourses();
    }, [fetchStudyCourses]);
    

    return (
        <div>
            
            <LoadingScreen isLoading={coursesLoading} />
            
            {canEdit &&
                <PrimaryButton label={'bindCourses'} iconComponent={<FaPlus/>}
                               onClick={() => setIsBindCoursesModalOpen(true)} className={'w-40 text-xs mb-2'}/>
            }

            {coursesData && coursesData.documents.length > 0 ? (
                <PaginatedContainer
                    documents={coursesData.documents}
                    currentPage={page}
                    totalPages={coursesData.totalPages}
                    onPageChange={setPage}
                    RenderComponent={({document}) => (
                        <Link key={document.name} to={`/courses/${document._id}`}
                              className="page-fade-enter page-fade-enter-active">
                            <StudyGroupCourseDataElement studyGroupId={studyGroup?._id || ''} course={document} key={document._id} canDelete={canEdit}/>
                        </Link>
                    )}
                />
            ) : (
                <NoDataMessage/>
            )}


            {isBindCoursesModalOpen && (
                <BindCoursesModal
                    onClose={() => setIsBindCoursesModalOpen(false)}
                    studyGroupId={studyGroup._id || ''}
                    institutionId={studyGroup?.institutionId || ''}
                    onSaveSuccess={() => setIsBindCoursesModalOpen(false)}
                />
            )}
        </div>
    );
};

export default StudyGroupCoursesTab;