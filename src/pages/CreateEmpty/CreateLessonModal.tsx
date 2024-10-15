import React, { useState } from 'react';
import ModalWrapper from '../ModalWrapper';
import { useCreateLesson } from '../../hooks/coursesHooks/useCreateLesson';
import InputField from "../../components/ui/inputs/InputField";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import SectionTitle from "../../components/ui/text/SectionTitle";

interface CreateLessonModalProps {
    onClose: () => void;
    onCreateSuccess?: () => void;
    courseId: string;
    courseName: string;
}

const CreateLessonModal: React.FC<CreateLessonModalProps> = ({ onClose, onCreateSuccess, courseId, courseName }) => {
    const [lessonName, setLessonName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const { mutate: createLesson, isLoading } = useCreateLesson();

    const handleCreateLesson = () => {
        if (lessonName.trim() === '') {
            setError("Lesson name cannot be empty.");
            return;
        }
        
        createLesson(
            { courseId, lessonName },
            {
                onSuccess: () => {
                    setError(null); 
                    if (onCreateSuccess) {
                        onCreateSuccess();
                    }
                    onClose(); 
                },
                onError: (error) => {
                    setError("Error creating lesson. Please try again.");
                    console.error("Error creating lesson:", error);
                },
            }
        );
    };

    return (
        <ModalWrapper onClose={onClose}>
            <div className="relative w-full mt-2 p-6 rounded-lg shadow-md text-left border-2 transform transition-transform duration-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <SectionTitle title={`Create a New Lesson in 「${courseName}`} className="text-center pb-4" />

                <InputField
                    id="lessonName"
                    value={lessonName}
                    onChange={(e) => {
                        setLessonName(e.target.value);
                        setError(null); 
                    }}
                    placeholder="Enter lesson name"
                    disabled={isLoading}
                    error={error}
                />

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="flex justify-center mt-4">
                    <PrimaryButton
                        label="Create"
                        onClick={handleCreateLesson}
                        disabled={isLoading || lessonName.trim() === ''}
                        className={`w-full ${isLoading || lessonName.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                </div>
            </div>
        </ModalWrapper>
    );
};

export default CreateLessonModal;