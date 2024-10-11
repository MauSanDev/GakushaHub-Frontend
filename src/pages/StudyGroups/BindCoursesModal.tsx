import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import ModalWrapper from '../ModalWrapper';
import { CourseData } from "../../data/CourseData.ts";
import { usePaginatedCourse } from "../../hooks/usePaginatedCourse.ts";
import { useAddCourseToGroup } from "../../hooks/institutionHooks/useAddCourseToGroup";
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import SearchBar from "../../components/ui/inputs/SearchBar.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import ShowSelectionToggle from "../../components/ui/toggles/ShowSelectionToggle.tsx";
import PaginatedContainer from "../../components/ui/containers/PaginatedContainer";
import SelectableCourseBox from "./SelectableCourseBox.tsx"; 

interface BindCoursesModalProps {
    onClose: () => void;
    institutionId?: string;
    studyGroupId: string;
    selectedCourses?: CourseData[];
    onSaveSuccess?: (selectedCourses: CourseData[]) => void;
}

const BindCoursesModal: React.FC<BindCoursesModalProps> = ({ onClose, institutionId, studyGroupId, onSaveSuccess }) => {
    const [selectedCourses, setSelectedCourses] = useState<CourseData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);
    const [page, setPage] = useState(1);

    
    const { data, isLoading, error, triggerFetch } = usePaginatedCourse(page, 99, searchTerm, institutionId);

    const { mutate: addCoursesToGroup, isLoading: isAdding } = useAddCourseToGroup();

    
    useEffect(() => {
        triggerFetch();
    }, [page, searchTerm, institutionId]);

    
    const filteredCourses = showSelectedOnly ? selectedCourses : (data?.documents ?? []);

    
    const handleSelectCourse = (course: CourseData) => {
        setSelectedCourses(prevSelected => [...prevSelected, course]);
    };

    const handleDeselectCourse = (course: CourseData) => {
        setSelectedCourses(prevSelected => prevSelected.filter(selected => selected._id !== course._id));
    };

    
    const handleAddCourses = () => {
        addCoursesToGroup(
            { studyGroupId, courseIds: selectedCourses.map(course => course._id) },
            {
                onSuccess: () => {
                    if (onSaveSuccess) {
                        onSaveSuccess(selectedCourses);
                    }
                    onClose?.();
                },
                onError: (error) => {
                    console.error("Error adding courses to group:", error);
                }
            }
        );
    };

    return (
        <ModalWrapper onClose={onClose}>
            <SectionContainer title={"Bind Courses to Study Group"} className={"h-[80vh]"} isLoading={isLoading} error={error?.message}>
                <div className="p-6 max-w-5xl w-full flex flex-col h-[80vh]">

                    <div className="flex gap-2 mb-4 w-full max-w-4xl justify-between items-center">

                        <SearchBar onSearch={setSearchTerm} placeholder={"Search Courses..."} />
                        <div className="flex gap-2">
                            <PrimaryButton iconComponent={<FaPlus/>} label={isAdding ? 'Adding...' : 'Add Courses'}
                                           onClick={handleAddCourses}
                                           disabled={selectedCourses.length === 0 || isAdding} className={"text-sm"}/>
                            <ShowSelectionToggle isSelected={showSelectedOnly}
                                                 onToggle={() => setShowSelectedOnly(!showSelectedOnly)}/>
                        </div>
                    </div>

                    {!isLoading && data && (
                        <PaginatedContainer
                            documents={filteredCourses} 
                            currentPage={page}
                            totalPages={data.totalPages}
                            onPageChange={setPage} 
                            RenderComponent={({ document }) => (
                                <SelectableCourseBox
                                    course={document}
                                    isSelected={selectedCourses.some(selected => selected._id === document._id)}
                                    onSelectCourse={handleSelectCourse}
                                    onDeselectCourse={handleDeselectCourse}
                                />
                            )}
                        />
                    )}
                </div>
            </SectionContainer>
        </ModalWrapper>
    );
};

export default BindCoursesModal;