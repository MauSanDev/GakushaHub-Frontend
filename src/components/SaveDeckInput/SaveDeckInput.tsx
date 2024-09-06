import React, { useState } from 'react';
import { FaCheck, FaClock, FaSave } from 'react-icons/fa';
import { usePaginatedCourse } from "../../hooks/usePaginatedCourse.ts";
import DropdownInput from "../DropdownInput/DropdownInput.tsx";
import { parseDecks, useBuildCourse } from "../../hooks/useBuildCourse.ts";
import { KanjiData } from "../../data/KanjiData.ts";
import { WordData } from "../../data/WordData.ts";
import { GrammarData } from "../../data/GrammarData.ts";
import { SaveStatus } from "../../utils/SaveStatus.ts";
import { GeneratedData } from "../../data/GenerationData.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import ConfigDropdown from "../ConfigDropdown.tsx";

interface SaveDeckInputProps {
    kanjiList: KanjiData[];
    wordList: WordData[];
    grammarList: GrammarData[];
    readingList: GeneratedData[];
    onSaveStatusChange?: (status: SaveStatus, error?: string) => void;
}

const SaveDeckInput: React.FC<SaveDeckInputProps> = ({ kanjiList, wordList, grammarList, readingList, onSaveStatusChange }) => {
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [selectedLesson, setSelectedLesson] = useState<string>('');
    const [selectedDeck, setSelectedDeck] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const { data } = usePaginatedCourse(1, 10);
    const { userData } = useAuth();

    const { mutate: buildCourse, isLoading: isSaving, isSuccess: saveSuccess } = useBuildCourse();

    if (!userData) return;

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

        if (selectedCourse && selectedLesson && selectedDeck) {
            buildCourse(
                {
                    courseId: courseData?._id || null,
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
        }
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

    return (
        <div className="flex flex-col gap-2">

            {/* ConfigDropdown Component */}
            <ConfigDropdown
                items={[
                    <DropdownInput
                        value={selectedCourse}
                        onChange={setSelectedCourse}
                        placeholder="Course"
                        options={getAvailableCourses()}
                        disabled={saveSuccess || isSaving}
                    />,
                    <DropdownInput
                        value={selectedLesson}
                        onChange={setSelectedLesson}
                        placeholder="Lesson"
                        options={getAvailableLessons()}
                        disabled={saveSuccess || isSaving}
                    />,
                    <DropdownInput
                        value={selectedDeck}
                        onChange={setSelectedDeck}
                        placeholder="Deck"
                        options={getAvailableDecks()}
                        disabled={saveSuccess || isSaving}
                    />,
                    error ? (
                        <p className="text-red-500 text-xs text-right">{error}</p>
                    ) : (
                        <p className="text-gray-500 text-xs text-right">{getContextMessage()}</p>
                    ),
                    /* Save Button moved inside the dropdown */
                    <button
                        onClick={handleSave}
                        className={`w-full flex items-center justify-center px-4 py-2 mt-2 rounded ${
                            saveSuccess
                                ? 'bg-green-500 text-white cursor-not-allowed'
                                : 'bg-blue-500 dark:bg-gray-700 text-white hover:bg-blue-600 dark:hover:bg-gray-600'
                        } transition-transform duration-300`}
                        disabled={saveSuccess || isSaving}
                    >
                        {saveSuccess ? <FaCheck /> : isSaving ? <FaClock /> : <FaSave />}
                    </button>
                ]}
                icon={<FaSave />} 
                buttonSize="text-xl"
            />
        </div>
    );
};

export default SaveDeckInput;