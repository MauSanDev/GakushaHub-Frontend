import React, { useState, useEffect } from 'react';
import { FaCheck, FaClock, FaSave } from 'react-icons/fa';
import DropdownInput from "../DropdownInput/DropdownInput.tsx";
import { parseDecks, useBuildCourse } from "../../hooks/useBuildCourse.ts";
import { SaveStatus } from "../../utils/SaveStatus.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import { useOwnerCourses } from "../../hooks/coursesHooks/useOwnerCourses.ts";
import LocSpan from "../LocSpan.tsx";
import { useTranslation } from "react-i18next";
import ModalWrapper from '../../pages/ModalWrapper.tsx';

interface SaveDeckInputProps {
    courseId?: string;
    courseName?: string;
    lessonName?: string;
    deckName?: string;
    kanjiList?: string[];
    wordList?: string[];
    grammarList?: string[];
    readingList?: string[];
    onSaveStatusChange?: (status: SaveStatus, error?: string) => void;
    isOpen: boolean; 
    onClose: () => void; 
}

const MAX_INPUT_LENGTH = 25;

const SaveDeckInput: React.FC<SaveDeckInputProps> = ({
                                                         kanjiList,
                                                         wordList,
                                                         grammarList,
                                                         readingList,
                                                         onSaveStatusChange,
                                                         courseId,
                                                         courseName,
                                                         lessonName,
                                                         deckName,
                                                         isOpen,
                                                         onClose,
                                                     }) => {
    const [selectedCourse, setSelectedCourse] = useState<string>(courseName || '');
    const [selectedLesson, setSelectedLesson] = useState<string>(lessonName || '');
    const [selectedDeck, setSelectedDeck] = useState<string>(deckName || '');
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();
    const { userData } = useAuth();

    const { data, fetchCourses } = useOwnerCourses(1, 99);

    useEffect(() => {
        fetchCourses(); 
    }, [fetchCourses]);

    const { mutate: buildCourse, isLoading: isSaving, isSuccess: saveSuccess } = useBuildCourse();

    const isCourseFixed = !!courseName || !!courseId;
    const isLessonFixed = !!lessonName;
    const isDeckFixed = !!deckName;

    const hasContent = (kanjiList && kanjiList?.length > 0)
        || (wordList && wordList.length > 0)
        || (grammarList && grammarList.length > 0)
        || (readingList && readingList.length > 0);

    if (!userData) return null;

    const validateInputLength = (input: string): boolean => {
        return input.length <= MAX_INPUT_LENGTH;
    };

    const getAvailableCourses = (): string[] => {
        return data?.documents.map((course) => course.name) ?? [];
    };

    const getAvailableLessons = (): string[] => {
        return data?.documents
            .find((course) => course.name === selectedCourse)
            ?.lessons.map((lesson) => lesson.name) ?? [];
    };

    const getAvailableDecks = (): string[] => {
        const lesson = data?.documents
            .find((course) => course.name === selectedCourse)
            ?.lessons.find((lesson) => lesson.name === selectedLesson);

        if (!lesson) return [];

        const decks = [
            ...(lesson.kanjiDecks || []),
            ...(lesson.grammarDecks || []),
            ...(lesson.wordDecks || []),
            ...(lesson.readingDecks || []),
        ];

        return decks
            .map((deck) => deck.name.replace(/ - (Words|Kanji|Grammar|Reading)$/, ''))
            .filter((name, index, self) => self.indexOf(name) === index);
    };

    const handleSave = async () => {
        if (!validateInputLength(selectedCourse) || !validateInputLength(selectedLesson) || !validateInputLength(selectedDeck)) {
            const errorMsg = t("saveDeckInput.charLimitExceeded").replace("{0}", MAX_INPUT_LENGTH.toString());
            setError(errorMsg);
            onSaveStatusChange?.(SaveStatus.Error, errorMsg);
            return;
        }

        if (!selectedDeck) {
            const errorMsg = t("saveDeckInput.deckInputEmpty");
            setError(errorMsg);
            onSaveStatusChange?.(SaveStatus.Error, errorMsg);
            return;
        }
        if (selectedCourse && !selectedLesson) {
            const errorMsg = t("saveDeckInput.lessonRequired");
            setError(errorMsg);
            onSaveStatusChange?.(SaveStatus.Error, errorMsg);
            return;
        }
        if (!selectedCourse && selectedLesson) {
            const errorMsg = t("saveDeckInput.courseRequired");
            setError(errorMsg);
            onSaveStatusChange?.(SaveStatus.Error, errorMsg);
            return;
        }

        setError(null);
        onSaveStatusChange?.(SaveStatus.Saving);

        const courseData = data?.documents.find((c) => c.name === selectedCourse);

        buildCourse(
            {
                courseId: courseId || courseData?._id || null,
                courseName: selectedCourse.trim(),
                lessonName: selectedLesson.trim(),
                decks: parseDecks(selectedDeck.trim(), kanjiList ?? [], wordList ?? [], grammarList ?? [], readingList ?? []),
            },
            {
                onSuccess: () => {
                    onSaveStatusChange?.(SaveStatus.Success);
                },
                onError: (error) => {
                    onSaveStatusChange?.(SaveStatus.Error, String(error));
                },
            }
        );
    };

    const getContextMessage = (): string | null => {
        if (!selectedCourse) return null;

        const courseData = data?.documents.find((c) => c.name === selectedCourse);
        if (!courseData) {
            return t("saveDeckInput.courseWillBeCreated").replace("{0}", selectedCourse);
        }

        if (!selectedLesson) return null;

        const lessonData = courseData.lessons.find((l) => l.name === selectedLesson);
        if (!lessonData) {
            return t("saveDeckInput.lessonWillBeCreated").replace("{0}", selectedLesson).replace("{1}", selectedCourse);
        }

        if (!selectedDeck) return null;

        const availableDecks = getAvailableDecks();
        if (!availableDecks.includes(selectedDeck)) {
            return t("saveDeckInput.deckWillBeCreated").replace("{0}", selectedDeck).replace("{1}", selectedLesson);
        }

        return t("saveDeckInput.contentWillBeAdded").replace("{0}", selectedDeck);
    };

    const dropdownContent = (
        <>
            <h1 className={"text-gray-500 text-xs"}><LocSpan textKey={"saveDeckInput.saveInto"} /></h1>
            <DropdownInput
                value={selectedCourse}
                onChange={setSelectedCourse}
                placeholder={t("course")}
                options={getAvailableCourses()}
                disabled={saveSuccess || isSaving || isCourseFixed}
            />
            <DropdownInput
                value={selectedLesson}
                onChange={setSelectedLesson}
                placeholder={t("lesson")}
                options={getAvailableLessons()}
                disabled={saveSuccess || isSaving || isLessonFixed}
            />
            <DropdownInput
                value={selectedDeck}
                onChange={setSelectedDeck}
                placeholder={t("deck")}
                options={getAvailableDecks()}
                disabled={saveSuccess || isSaving || isDeckFixed}
            />
            {error ? (
                <p className="text-red-500 text-xs text-right">{error}</p>
            ) : (
                <p className="text-gray-500 text-xs text-right">{getContextMessage()}</p>
            )}
            <button
                onClick={handleSave}
                className={`w-full flex items-center justify-center px-4 py-2 mt-2 rounded ${
                    !hasContent || saveSuccess || isSaving
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 dark:bg-blue-700 text-white hover:bg-blue-600 dark:hover:bg-blue-600'
                } transition-transform duration-300`}
                disabled={!hasContent || saveSuccess || isSaving}
            >
                {saveSuccess ? <FaCheck /> : isSaving ? <FaClock /> : <FaSave />}
            </button>
        </>
    );

    if (!isOpen) return null;

    return (
        <ModalWrapper onClose={onClose}>
            {dropdownContent}
        </ModalWrapper>
    );
};

export default SaveDeckInput;