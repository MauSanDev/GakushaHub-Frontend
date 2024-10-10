import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import ModalWrapper from '../ModalWrapper';
import { CourseData } from "../../data/CourseData.ts";
import SelectableCourseBox from './SelectableCourseBox.tsx';
import LoadingScreen from "../../components/LoadingScreen";
import { usePaginatedCourse } from "../../hooks/usePaginatedCourse.ts";
import { useAddCourseToGroup } from "../../hooks/institutionHooks/useAddCourseToGroup";

interface BindCoursesModalProps {
    onClose?: () => void;
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
    const [showSelectedOnly, setShowSelectedOnly] = useState(false); // Estado para manejar el toggle
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data: ownerData, isLoading: ownerLoading, error: ownerError } = usePaginatedCourse(page, 99, institutionId);

    const data = ownerData;
    const isLoading = ownerLoading;
    const error = ownerError;

    const hasMore = data ? page < (data.totalPages ?? 1) : false;

    const { mutate: addCoursesToGroup, isLoading: isAdding } = useAddCourseToGroup(); // Hook para agregar cursos

    // Actualiza la lista de cursos cuando se recibe nueva data
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

    // Filtra los cursos según el término de búsqueda
    useEffect(() => {
        const filtered = courses.filter(course =>
            course.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCourses(showSelectedOnly ? selectedCourses : filtered);
    }, [searchTerm, courses, showSelectedOnly, selectedCourses]);

    // Maneja el scroll infinito
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

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
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
            <div className="p-6 max-w-5xl w-full flex flex-col h-[80vh]">
                <h2 className="text-2xl font-bold mb-4">Bind Courses to Study Group</h2>

                <div className="flex gap-2 mb-4 w-full max-w-4xl justify-between items-center">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="flex-grow px-4 py-2 rounded lg:text-sm text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    />
                    <div className="flex gap-2">
                        <button
                            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2 text-xs ${selectedCourses.length === 0 || isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={selectedCourses.length === 0 || isAdding}
                            onClick={handleAddCourses}
                        >
                            <FaPlus />
                            {isAdding ? 'Adding...' : 'Add Courses'}
                        </button>
                        <button
                            onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                            className={`whitespace-nowrap text-xs border dark:border-gray-700 rounded-full px-3 py-2 transition-all duration-300 transform lg:hover:scale-105 hover:shadow-md flex items-center gap-2 ${
                                showSelectedOnly
                                    ? 'bg-blue-500 dark:bg-green-900 text-white'
                                    : 'bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-blue-300 hover:text-white'
                            }`}
                        >
                            {showSelectedOnly ? <FaEyeSlash /> : <FaEye />}
                            {showSelectedOnly ? 'Show All' : 'Show Selected'}
                        </button>
                    </div>
                </div>

                {/* Contenedor scrolleable para la lista de cursos */}
                <div
                    ref={scrollContainerRef}
                    className="w-full max-w-4xl flex-grow overflow-y-auto flex flex-col gap-6 pb-4"
                >
                    {isLoading && <LoadingScreen isLoading={isLoading} />}

                    {error && <p className="text-red-500">{String(error)}</p>}

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
        </ModalWrapper>
    );
};

export default BindCoursesModal;