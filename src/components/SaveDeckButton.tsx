import React, {useState} from 'react';
import {FaCheck, FaSave} from 'react-icons/fa';
import SaveDeckModal from "./SaveDeckModal.tsx";
import {SaveStatus} from "../utils/SaveStatus.ts";
import PrimaryButton from "./ui/buttons/PrimaryButton.tsx";

interface SaveDeckButtonProps {
    kanjiIds?: string[],
    grammarIds?: string[],
    wordIds?: string[],
    readingIds?: string[],
    courseId?: string;
    courseName?: string;
    lessonName?: string;
    deckName?: string;
    onSaveStatusChange?: (status: SaveStatus, error?: string) => void;
}


const SaveDeckButton: React.FC<SaveDeckButtonProps> = ({ kanjiIds, wordIds, grammarIds, readingIds, onSaveStatusChange, deckName, lessonName, courseId, courseName }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.Idle);

    const openModal = () => {
        if (saved) return;
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const onSave = (status: SaveStatus) => {
        setSaveStatus(status);
        
        if (status === SaveStatus.Success)
        {
            onSaveStatusChange?.(status)
        }
    };
    
    const haveContent = (kanjiIds?.length || 0) > 0 || (grammarIds?.length || 0) > 0 || (wordIds?.length || 0) > 0 || (readingIds?.length || 0) > 0;

    const saved = saveStatus === SaveStatus.Success;

return (
    <>
        <PrimaryButton onClick={openModal} iconComponent={saved ? <FaCheck /> : <FaSave />} label={saved ? "saved" : "save"} disabled={saved || !haveContent}/>

        {isModalOpen &&
            <SaveDeckModal
                onClose={closeModal}
                courseId={courseId}
                courseName={courseName}
                lessonName={lessonName}
                deckName={deckName}
                kanjiIds={kanjiIds}
                readingIds={readingIds}
                wordIds={wordIds}
                grammarIds={grammarIds}
                onSaveStatusChange={onSave}
            />}
    </>
);
};

export default SaveDeckButton;