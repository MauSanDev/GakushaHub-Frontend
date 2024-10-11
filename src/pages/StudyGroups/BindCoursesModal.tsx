import React, { useState, useEffect, useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import ModalWrapper from '../ModalWrapper';
import { CourseData } from "../../data/CourseData.ts";
import SelectableCourseBox from './SelectableCourseBox.tsx';
import { usePaginatedCourse } from "../../hooks/usePaginatedCourse.ts";
import { useAddCourseToGroup } from "../../hooks/institutionHooks/useAddCourseToGroup";
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import SearchBar from "../../components/ui/inputs/SearchBar.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import ShowSelectionToggle from "../../components/ui/toggles/ShowSelectionToggle.tsx";

interface BindCoursesModalProps {
    onClose: () => void;
    institutionId?: string;
    studyGroupId: string;
    selectedCourses?: CourseData[];
    onSaveSuccess?: (selectedCourses: CourseData[]) => void;
}

const BindCoursesModal: React.FC<BindCoursesModalProps> = ({ onClose, institutionId, studyGroupId, onSaveSuccess }) => {
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<CourseData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCourses, setFilteredCourses] = useState<CourseData[]>([]);
    const [page, setPage] = useState(1);
    const [showSelectedOnly, setShowSelectedOnly] = useState(false); 
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data: ownerData, isLoading: ownerLoading, error: ownerError } = usePaginatedCourse(page, 99, institutionId);

    const data = ownerData;
    const isLoading = ownerLoading;
    const error = ownerError;

    const hasMore = data ? page < (data.totalPages ?? 1) : false;

    const { mutate: addCoursesToGroup, isLoading: isAdding } = useAddCourseToGroup(); 

    
    useEffect(() => {
        if (data) {
            setCourses(prevCourses => {
                const newCourses = data.documents.filter(newCourse =>
                    !prevCourses.some(course => course._id === newCourse._id)
                );
                return [...prevCourses, ...newCourses];
            });
        }
    }, [data]);

    
    useEffect(() => {
        const filtered = courses.filter(course =>
            course.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCourses(showSelectedOnly ? selectedCourses : filtered);
    }, [searchTerm, courses, showSelectedOnly, selectedCourses]);

    
    useEffect(() => {
        const handleScroll = () => {
            const scrollContainer = scrollContainerRef.current;
            if (scrollContainer) {
                const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
                if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore) {
                    setPage(prevPage => prevPage + 1);
                }
            }
        };

        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [hasMore]);

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

                        <SearchBar onSearch={setSearchTerm} placeholder={"Search Members..."}/>
                        <div className="flex gap-2">
                            <PrimaryButton iconComponent={<FaPlus/>} label={isAdding ? 'Adding...' : 'Add Members'}
                                           onClick={handleAddCourses}
                                           disabled={selectedCourses.length === 0 || isAdding} className={"text-sm"}/>
                            <ShowSelectionToggle isSelected={showSelectedOnly}
                                                 onToggle={() => setShowSelectedOnly(!showSelectedOnly)}/>
                        </div>
                    </div>

                    <div
                        ref={scrollContainerRef}
                        className="w-full max-w-4xl flex-grow overflow-y-auto flex flex-col gap-6 pb-4"
                    >

                        {filteredCourses.length > 0 ? (
                            filteredCourses.map((course, index) => (
                                <SelectableCourseBox
                                    key={index}
                                    course={course}
                                    isSelected={selectedCourses.some(selected => selected._id === course._id)}
                                    onSelectCourse={handleSelectCourse}
                                    onDeselectCourse={handleDeselectCourse}
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No courses found</p>
                        )}
                    </div>
                </div>
            </SectionContainer>
        </ModalWrapper>
    );
};

export default BindCoursesModal;