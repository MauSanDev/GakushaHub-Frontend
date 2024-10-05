import React from 'react';
import ModalWrapper from '../ModalWrapper';
import SearchPage from './SearchPage';

interface SearchModalProps {
    onClose?: () => void;
    courseId?: string;
    courseName?: string;
    lessonName?: string;
    deckName?: string;
    onSaveSuccess?: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose, courseId, courseName, lessonName, deckName, onSaveSuccess }) => {
    return (
        <ModalWrapper onClose={onClose}>
            <SearchPage 
                courseId={courseId}
                courseName={courseName}
                lessonName={lessonName}
                deckName={deckName} 
                onSaveSuccess={onSaveSuccess}
            />
        </ModalWrapper>
    );
};

export default SearchModal;