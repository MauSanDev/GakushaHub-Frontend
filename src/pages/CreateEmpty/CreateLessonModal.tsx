import React, { useState } from 'react';
import ModalWrapper from '../ModalWrapper';

interface CreateLessonModalProps {
    onClose?: () => void;
    onCreateSuccess?: () => void;
    courseId: string; 
}

const CreateLessonModal: React.FC<CreateLessonModalProps> = ({ onClose, onCreateSuccess, courseId }) => {
    const [lessonName, setLessonName] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const handleCreateLesson = async () => {
        
        try {
            
            await createLesson({ courseId, lessonName, description });
            onCreateSuccess && onCreateSuccess();
            onClose && onClose();
        } catch (error) {
            console.error("Error creating lesson:", error);
        }
    };

    return (
        <ModalWrapper onClose={onClose}>
            <div>
                <h2>Create New Lesson</h2>
                <input
                    type="text"
                    value={lessonName}
                    onChange={(e) => setLessonName(e.target.value)}
                    placeholder="Lesson Name"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Lesson Description"
                />
                <button onClick={handleCreateLesson}>Create</button>
            </div>
        </ModalWrapper>
    );
};

export default CreateLessonModal;