import React, { useState } from 'react';
import ModalWrapper from '../ModalWrapper';
import { useCreateLesson } from '../../hooks/coursesHooks/useCreateLesson.ts';

interface CreateLessonModalProps {
    onClose?: () => void;
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

        createLesson({ courseId, lessonName }, {
            onSuccess: () => {
                setError(null); // Clear error on success
                if (onCreateSuccess) {
                    onCreateSuccess();
                }
                if (onClose) {
                    onClose();
                }
            },
            onError: (error) => {
                setError("Error creating lesson. Please try again.");
                console.error("Error creating lesson:", error);
            },
        });
    };

    return (
        <ModalWrapper onClose={onClose}>
            <div className="relative p-6 rounded-lg shadow-md text-left border-2 transform transition-transform duration-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <h2 className="text-2xl font-bold mb-4 text-blue-900 dark:text-white text-center">Create a New Lesson in {courseName}</h2>

                <div className="mb-4">
                    <input
                        type="text"
                        id="lessonName"
                        value={lessonName}
                        onChange={(e) => {
                            setLessonName(e.target.value);
                            setError(null); // Clear error when typing
                        }}
                        placeholder="Enter lesson name"
                        disabled={isLoading}
                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 ${
                            error ? 'border-red-500' : ''
                        }`}
                    />
                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleCreateLesson}
                        disabled={isLoading || lessonName.trim() === ''}
                        className={`inline-flex w-full justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-400 dark:bg-blue-800 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            isLoading || lessonName.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default CreateLessonModal;