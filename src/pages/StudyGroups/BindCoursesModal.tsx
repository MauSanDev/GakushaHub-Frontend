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
import CourseDataElement from "../../components/CourseDataElement.tsx"; // Importa el componente de paginación

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

    // Uso del hook para obtener los cursos paginados
    const { data, isLoading, error, triggerFetch } = usePaginatedCourse(page, 99, searchTerm, institutionId);

    const { mutate: addCoursesToGroup, isLoading: isAdding } = useAddCourseToGroup();

    // Ejecuta triggerFetch cada vez que cambian la página, el término de búsqueda o el institutionId
    useEffect(() => {
        triggerFetch();
    }, [page, searchTerm, institutionId]);

    // Filtra los cursos según el término de búsqueda y si se muestran solo los seleccionados
    const filteredCourses = showSelectedOnly ? selectedCourses : (data?.documents ?? []);

    // Funciones de selección y deselección de cursos
    const handleSelectCourse = (course: CourseData) => {
        setSelectedCourses(prevSelected => [...prevSelected, course]);
    };

    const handleDeselectCourse = (course: CourseData) => {
        setSelectedCourses(prevSelected => prevSelected.filter(selected => selected._id !== course._id));
    };

    // Agrega los cursos seleccionados al grupo de estudio
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

                    {/* Uso de PaginatedContainer para manejar la paginación */}
                    {!isLoading && data && (
                        <PaginatedContainer
                            documents={filteredCourses} // Cursos filtrados
                            currentPage={page}
                            totalPages={data.totalPages}
                            onPageChange={setPage} // Cambia de página
                            RenderComponent={({ document }) => (
                                <CourseDataElement
                                    course={document}
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