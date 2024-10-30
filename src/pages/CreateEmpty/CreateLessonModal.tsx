import React, { useState } from 'react';
import ModalWrapper from '../ModalWrapper';
import { useCreateLesson } from '../../hooks/coursesHooks/useCreateLesson';
import InputField from "../../components/ui/inputs/InputField";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import LocSpan from "../../components/LocSpan.tsx";

interface CreateLessonModalProps {
    onClose: () => void;
    onCreateSuccess?: (createdId: string) => void;
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
                onSuccess: (x) => {
                    setError(null); 
                    if (onCreateSuccess) {
                        onCreateSuccess(x._id);
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
                <h2 className="text-2xl font-bold mb-4 text-blue-900 dark:text-white text-center">
                    <LocSpan textKey={"createLessonKeys.title"} replacements={[courseName as string]}/>
                </h2>
                <InputField
                    id="lessonName"
                    value={lessonName}
                    onChange={(e) => {
                        setLessonName(e.target.value);
                        setError(null); 
                    }}
                    placeholder="lessonName"
                    disabled={isLoading}
                    error={error}
                />

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="flex justify-center mt-4">
                    <PrimaryButton
                        label="create"
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