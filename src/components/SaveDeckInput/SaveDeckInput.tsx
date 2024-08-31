import React, { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import {usePaginatedCourse} from "../../hooks/usePaginatedCourse.ts";
import DropdownInput from "../DropdownInput/DropdownInput.tsx";

interface SaveDeckInputProps {
    onSave: (
        courseId: string | null,
        courseName: string,
        lessonName: string,
        deckName: string
    ) => void;
}

const SaveDeckInput: React.FC<SaveDeckInputProps> = ({ onSave }) => {
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [selectedLesson, setSelectedLesson] = useState<string>('');
    const [selectedDeck, setSelectedDeck] = useState<string>('');
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);
    const [initialSave, setInitialSave] = useState(false);

    const [showCourseDropdown, setShowCourseDropdown] = useState(false);
    const [showLessonDropdown, setShowLessonDropdown] = useState(false);
    const [showDeckDropdown, setShowDeckDropdown] = useState(false);
    
    const { data } = usePaginatedCourse(1, 10)

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
            ?.lessons.find((lesson) => lesson.name === selectedLesson)

        if (!lesson) return []

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
        if (!initialSave) {
            setExpanded(true);
            setInitialSave(true);
            return;
        }

        if (!selectedDeck) {
            setError('The "Deck" field is required.');
            return;
        }
        if (selectedCourse && !selectedLesson) {
            setError('If a Course is provided, a Lesson is required.');
            return;
        }
        if (!selectedCourse && selectedLesson) {
            setError('If a Lesson is provided, a Course is required.');
            return;
        }

        setError(null);

        const courseData = data?.documents.find((c) => c.name === selectedCourse);
        
        if (courseData && selectedLesson && selectedDeck) {
            onSave(
                courseData?._id || null,
                selectedCourse.trim(),
                selectedLesson.trim(),
                selectedDeck.trim()
            );
            setSaved(true);
        }
    };

    const getContextMessage = () => {
        if (selectedCourse) {
            const courseData = data?.documents.find((c) => c.name === selectedCourse);
            if (!selectedCourse) {
                return `The Course "${selectedCourse}" will be created.`;
            } else if (selectedLesson) {
                const lessonData = courseData?.lessons.find((l) => l.name === selectedLesson);
                if (!lessonData) {
                    return `The Lesson "${selectedLesson}" will be added to the Course "${selectedCourse}".`;
                } else if (selectedDeck) {
                    if (!getAvailableDecks().includes(selectedDeck)) {
                        return `The deck "${selectedDeck}" will be added to the Lesson "${selectedLesson}".`;
                    } else {
                        return `The content will be added to the existing Deck "${selectedDeck}".`;
                    }
                }
            }
        }
        return null;
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <DropdownInput
                    value={selectedCourse}
                    onChange={setSelectedCourse}
                    placeholder="Course"
                    options={getAvailableCourses()}
                    disabled={saved}
                    expanded={expanded}
                    onFocus={() => {
                        setShowCourseDropdown(true);
                        setShowLessonDropdown(false);
                        setShowDeckDropdown(false);
                    }}
                    showDropdown={showCourseDropdown}
                    setShowDropdown={setShowCourseDropdown}
                />

                <span className={`${expanded ? 'visible' : 'invisible'}`}>/</span>

                <DropdownInput
                    value={selectedLesson}
                    onChange={setSelectedLesson}
                    placeholder="Lesson"
                    options={getAvailableLessons()}
                    disabled={saved}
                    expanded={expanded}
                    onFocus={() => {
                        setShowLessonDropdown(true);
                        setShowCourseDropdown(false);
                        setShowDeckDropdown(false);
                    }}
                    showDropdown={showLessonDropdown}
                    setShowDropdown={setShowLessonDropdown}
                />

                <span className={`${expanded ? 'visible' : 'invisible'}`}>/</span>

                <DropdownInput
                    value={selectedDeck}
                    onChange={setSelectedDeck}
                    placeholder="Deck"
                    options={getAvailableDecks()}
                    disabled={saved}
                    expanded={expanded}
                    onFocus={() => {
                        setShowDeckDropdown(true);
                        setShowCourseDropdown(false);
                        setShowLessonDropdown(false);
                    }}
                    showDropdown={showDeckDropdown}
                    setShowDropdown={setShowDeckDropdown}
                />

                <button
                    onClick={handleSave}
                    className={`flex items-center justify-center px-4 py-2 rounded ${
                        saved ? 'bg-green-500 text-white cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                    } transition-transform duration-300`}
                    disabled={saved}
                >
                    {saved ? 'Saved' : <FaSave />}
                </button>
            </div>

            {/* Mensaje contextual o de error */}
            {error ? (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            ) : (
                <p className="text-gray-500 text-xs text-right">{getContextMessage()}</p>
            )}
        </div>
    );
};

export default SaveDeckInput;