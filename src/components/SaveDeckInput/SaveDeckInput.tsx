import React, { useState } from 'react';
import { FaCheck, FaClock, FaSave } from 'react-icons/fa';
import DropdownInput from "../DropdownInput/DropdownInput.tsx";
import { parseDecks, useBuildCourse } from "../../hooks/useBuildCourse.ts";
import { KanjiData } from "../../data/KanjiData.ts";
import { WordData } from "../../data/WordData.ts";
import { GrammarData } from "../../data/GrammarData.ts";
import { SaveStatus } from "../../utils/SaveStatus.ts";
import { GeneratedData } from "../../data/GenerationData.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import ConfigDropdown from "../ConfigDropdown.tsx";
import { useOwnerCourses } from "../../hooks/coursesHooks/useOwnerCourses.ts";
import { createPortal } from 'react-dom';

interface SaveDeckInputProps {
    courseId?: string;
    courseName?: string;
    lessonName?: string;
    deckName?: string;
    kanjiList: KanjiData[];
    wordList: WordData[];
    grammarList: GrammarData[];
    readingList: GeneratedData[];
    onSaveStatusChange?: (status: SaveStatus, error?: string) => void;
}

const MAX_INPUT_LENGTH = 12;

const SaveDeckInput: React.FC<SaveDeckInputProps> = ({
                                                         kanjiList,
                                                         wordList,
                                                         grammarList,
                                                         readingList,
                                                         onSaveStatusChange,
                                                         courseId,
                                                         courseName,
                                                         lessonName,
                                                         deckName
                                                     }) => {
    const [selectedCourse, setSelectedCourse] = useState<string>(courseName || '');
    const [selectedLesson, setSelectedLesson] = useState<string>(lessonName || '');
    const [selectedDeck, setSelectedDeck] = useState<string>(deckName || '');
    const [error, setError] = useState<string | null>(null);
    const { data } = useOwnerCourses(1, 99);
    const { userData } = useAuth();

    const { mutate: buildCourse, isLoading: isSaving, isSuccess: saveSuccess } = useBuildCourse();

    const isCourseFixed = !!courseName || !!courseId;
    const isLessonFixed = !!lessonName;
    const isDeckFixed = !!deckName;

    // Verificar si las listas de contenido están vacías
    const hasContent = kanjiList.length > 0 || wordList.length > 0 || grammarList.length > 0 || readingList.length > 0;

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
            const errorMsg = `One or more fields exceed the maximum character limit of ${MAX_INPUT_LENGTH}.`;
            setError(errorMsg);
            onSaveStatusChange?.(SaveStatus.Error, errorMsg);
            return;
        }

        if (!selectedDeck) {
            const errorMsg = 'The "Deck" field is required.';
            setError(errorMsg);
            onSaveStatusChange?.(SaveStatus.Error, errorMsg);
            return;
        }
        if (selectedCourse && !selectedLesson) {
            const errorMsg = 'If a Course is provided, a Lesson is required.';
            setError(errorMsg);
            onSaveStatusChange?.(SaveStatus.Error, errorMsg);
            return;
        }
        if (!selectedCourse && selectedLesson) {
            const errorMsg = 'If a Lesson is provided, a Course is required.';
            setError(errorMsg);
            onSaveStatusChange?.(SaveStatus.Error, errorMsg);
            return;
        }

        setError(null);
        onSaveStatusChange?.(SaveStatus.Saving);

        const courseData = data?.documents.find((c) => c.name === selectedCourse);

        buildCourse(
            {
                courseId: courseId || courseData?._id || null, // Pasar courseId desde props o buscarlo
                courseName: selectedCourse.trim(),
                lessonName: selectedLesson.trim(),
                decks: parseDecks(selectedDeck.trim(), kanjiList, wordList, grammarList, readingList),
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
            return `The Course "${selectedCourse}" will be created.`;
        }

        if (!selectedLesson) return null;

        const lessonData = courseData.lessons.find((l) => l.name === selectedLesson);
        if (!lessonData) {
            return `The Lesson "${selectedLesson}" will be added to the Course "${selectedCourse}".`;
        }

        if (!selectedDeck) return null;

        const availableDecks = getAvailableDecks();
        if (!availableDecks.includes(selectedDeck)) {
            return `The deck "${selectedDeck}" will be added to the Lesson "${selectedLesson}".`;
        }

        return `The content will be added to the existing Deck "${selectedDeck}".`;
    };

    const dropdownContent = (
        <div className="absolute top-0 right-0 z-50 flex flex-col gap-2 shadow-lg p-4 rounded-md">
            <ConfigDropdown
                baseColor={"dark:bg-blue-700 dark:hover:bg-blue-500"}
                items={[
                    <h1 className={"text-gray-500 text-xs"}>Save into collection:</h1>,
                    <DropdownInput
                        value={selectedCourse}
                        onChange={setSelectedCourse}
                        placeholder="Course"
                        options={getAvailableCourses()}
                        disabled={saveSuccess || isSaving || isCourseFixed} // Disabled if set by props or courseId
                    />,
                    <DropdownInput
                        value={selectedLesson}
                        onChange={setSelectedLesson}
                        placeholder="Lesson"
                        options={getAvailableLessons()}
                        disabled={saveSuccess || isSaving || isLessonFixed} // Disabled if set by props
                    />,
                    <DropdownInput
                        value={selectedDeck}
                        onChange={setSelectedDeck}
                        placeholder="Deck"
                        options={getAvailableDecks()}
                        disabled={saveSuccess || isSaving || isDeckFixed} // Disabled if set by props
                    />,
                    error ? (
                        <p className="text-red-500 text-xs text-right">{error}</p>
                    ) : (
                        <p className="text-gray-500 text-xs text-right">{getContextMessage()}</p>
                    ),
                    <button
                        onClick={handleSave}
                        className={`w-full flex items-center justify-center px-4 py-2 mt-2 rounded ${
                            !hasContent || saveSuccess || isSaving
                                ? 'bg-gray-300 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 dark:bg-blue-700 text-white hover:bg-blue-600 dark:hover:bg-blue-600'
                        } transition-transform duration-300`}
                        disabled={!hasContent || saveSuccess || isSaving} // Deshabilitar si no hay contenido
                    >
                        {saveSuccess ? <FaCheck /> : isSaving ? <FaClock /> : <FaSave />}
                    </button>
                ]}
                icon={<FaSave />}
                buttonSize="text-xl"
            />
        </div>
    );

    return createPortal(
        dropdownContent,
        document.getElementById("modal-root")!
    );
};

export default SaveDeckInput;