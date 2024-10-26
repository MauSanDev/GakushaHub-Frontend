import React, { useEffect, useState } from 'react';
import ModalWrapper from '../ModalWrapper';
import { useCreateCourse } from '../../hooks/coursesHooks/useCreateCourse.ts';
import { useInstitutionById } from "../../hooks/institutionHooks/useInstitutionById.ts";
import InputField from "../../components/ui/inputs/InputField";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import LocSpan from "../../components/LocSpan.tsx";

interface CreateCourseModalProps {
    institutionId?: string;
    onClose: () => void;
    onCreateSuccess?: () => void;
}

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ institutionId, onClose, onCreateSuccess }) => {
    const [courseName, setCourseName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const { mutate: createCourse, isLoading } = useCreateCourse();
    const { data, fetchInstitution, isLoading: institutionLoading } = useInstitutionById(institutionId || "");
    
    useEffect(() => {
        if (institutionId) {
            fetchInstitution();
        }
    }, [institutionId, fetchInstitution]);

    const handleCreateCourse = () => {
        if (courseName.trim() === '') {
            setError("Course name cannot be empty.");
            return;
        }

        createCourse({ courseName, institutionId }, {
            onSuccess: () => {
                setError(null);
                if (onCreateSuccess) {
                    onCreateSuccess();
                }
                if (onClose) {
                    onClose();
                }
            },
            onError: (error) => {
                setError("Error creating course. Please try again.");
                console.error("Error creating course:", error);
            },
        });
    };

    return (
        <ModalWrapper onClose={onClose}>
            <div className="relative p-6 w-full mt-2 rounded-lg shadow-md text-left border-2 transform transition-transform duration-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <h2 className="text-2xl font-bold mb-4 text-blue-900 dark:text-white text-center">
                    <LocSpan textKey={"createCourseKeys.title"} replacements={[data?.name as string]} />
                </h2>

                {/* Input para el nombre del curso */}
                <InputField
                    id="courseName"
                    value={courseName}
                    onChange={(e) => {
                        setCourseName(e.target.value);
                        setError(null);
                    }}
                    placeholder="createCourseKeys.courseName"
                    disabled={isLoading || institutionLoading}
                    error={error}
                />

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="flex justify-center mt-4">
                    <PrimaryButton
                        label="create"
                        onClick={handleCreateCourse}
                        disabled={isLoading || institutionLoading || courseName.trim() === ''}
                        className={`w-full ${isLoading || courseName.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                </div>
            </div>
        </ModalWrapper>
    );
};

export default CreateCourseModal;