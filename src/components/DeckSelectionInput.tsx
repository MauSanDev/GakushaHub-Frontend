import React, { useState, useEffect } from 'react';
import { usePaginatedCourse } from "../hooks/usePaginatedCourse.ts";
import DropdownInput from "./DropdownInput/DropdownInput.tsx";
import { parseDecks, useBuildCourse } from "../hooks/useBuildCourse.ts";
import { KanjiData } from "../data/KanjiData.ts";
import { WordData } from "../data/WordData.ts";
import { GrammarData } from "../data/GrammarData.ts";
import { SaveStatus } from "../utils/SaveStatus.ts";
import { GeneratedData } from "../data/GenerationData.ts";

interface DeckSelectionInputProps {
    kanjiList: KanjiData[],
    wordList: WordData[],
    grammarList: GrammarData[],
    readingList: GeneratedData[],
    onSaveStatusChange?: (status: SaveStatus, error?: string) => void;
    onSaveTriggered: boolean;
    onSelectionComplete: (isComplete: boolean) => void;
}

const DeckSelectionInput: React.FC<DeckSelectionInputProps> = ({ kanjiList, wordList, grammarList, readingList, onSaveStatusChange, onSaveTriggered, onSelectionComplete }) => {
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [selectedLesson, setSelectedLesson] = useState<string>('');
    const [selectedDeck, setSelectedDeck] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const { data } = usePaginatedCourse(1, 10);

    const { mutate: buildCourse, isLoading: isSaving, isSuccess: saveSuccess } = useBuildCourse();

    useEffect(() => {
        onSelectionComplete(!!(selectedCourse && selectedLesson && selectedDeck));
    }, [selectedCourse, selectedLesson, selectedDeck, onSelectionComplete]);

    useEffect(() => {
        if (onSaveTriggered) {
            handleSave();
        }
    }, [onSaveTriggered]);

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
            ...lesson.kanjiDecks,
            ...lesson.grammarDecks,
            ...lesson.wordDecks
        ];

        return decks
            .map((deck) => deck.name.replace(/ - (Words|Kanji|Grammar)$/, ''))
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
            buildCourse({
                courseId: courseData?._id || null,
                courseName: selectedCourse.trim(),
                lessonName: selectedLesson.trim(),
                decks: parseDecks(selectedDeck.trim(), kanjiList, wordList, grammarList, readingList)
            }, {
                onSuccess: () => {
                    onSaveStatusChange?.(SaveStatus.Success);
                    console.log('Save successful'); // Console log al final
                },
                onError: (error) => {
                    onSaveStatusChange?.(SaveStatus.Error, String(error));
                    console.log('Save failed'); // Console log en caso de error
                }
            });
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
        <div className="gap-2">
            <p className="text-gray-500 text-xs text-center inline pl-3">Save to: </p>
            {error ? (
                <p className="text-red-500 text-xs text-ri inline">{error}</p>
            ) : (
                <p className="text-gray-500 text-xs text-left inline">{getContextMessage()}</p>
            )}
            <div className="relative w-full justify-end border border-gray-300 rounded">
                <div className="flex items-center gap-2 max-w-full overflow-visible transition-transform duration-500">
                    <DropdownInput
                        value={selectedCourse}
                        onChange={setSelectedCourse}
                        placeholder="Course"
                        options={getAvailableCourses()}
                        disabled={saveSuccess || isSaving}
                    />
                    <span>/</span>
                    <DropdownInput
                        value={selectedLesson}
                        onChange={setSelectedLesson}
                        placeholder="Lesson"
                        options={getAvailableLessons()}
                        disabled={saveSuccess || isSaving}
                    />
                    <span>/</span>
                    <DropdownInput
                        value={selectedDeck}
                        onChange={setSelectedDeck}
                        placeholder="Deck"
                        options={getAvailableDecks()}
                        disabled={saveSuccess || isSaving}
                    />
                </div>
            </div>
        </div>
    );
};

export default DeckSelectionInput;