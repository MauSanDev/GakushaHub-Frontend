import React, { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';
interface DropdownInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    options: string[];
    disabled: boolean;
    expanded: boolean;
    onFocus: () => void;
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
}

const DropdownInput: React.FC<DropdownInputProps> = ({
                                                         value,
                                                         onChange,
                                                         placeholder,
                                                         options,
                                                         disabled,
                                                         expanded,
                                                         onFocus,
                                                         showDropdown,
                                                         setShowDropdown
                                                     }) => {
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

    useEffect(() => {
        if (value) {
            setFilteredOptions(
                options.filter((option) =>
                    option.toLowerCase().includes(value.toLowerCase())
                )
            );
        } else {
            setFilteredOptions(options);
        }
    }, [value, options]);

    // Detectar si el texto del input matchea exactamente con una opción del dropdown
    const isExactMatch = filteredOptions.some(
        (option) => option.toLowerCase() === value.toLowerCase()
    );

    return (
        <div
            className={`relative transition-all duration-500 ${
                expanded ? 'flex-grow' : 'w-0'
            } overflow-visible`}
        >
            <input
                type="text"
                value={value}
                onClick={() => {
                    if (options.length > 0) {
                        setShowDropdown(true);
                    }
                }}
                onFocus={() => {
                    onFocus();
                    setShowDropdown(true);
                }}
                onBlur={() => {
                    setTimeout(() => setShowDropdown(false), 200);
                }}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`focus:outline-none w-full text-sm p-2 placeholder-gray-500 ${
                    isExactMatch ? 'text-blue-500' : ''
                }`}
                disabled={disabled}
                style={{ border: 'none' }}
            />
            {showDropdown && filteredOptions.length > 0 && (
                <ul className="absolute w-full bg-blue-500 text-white rounded shadow-lg max-h-40 overflow-y-auto z-10 mt-1 text-sm">
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                onChange(option);
                                setShowDropdown(false);
                            }}
                            className="cursor-pointer hover:bg-blue-600 p-2"
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

interface Deck {
    _id: string;
    name: string;
}

interface Lesson {
    _id: string;
    name: string;
    kanjiDecks: Deck[];
    grammarDecks: Deck[];
    wordDecks: Deck[];
}

interface Course {
    _id: string;
    name: string;
    lessons: Lesson[];
}

interface SaveDeckInputProps {
    onSave: (
        courseId: string | null,
        courseName: string,
        lessonName: string,
        deckName: string
    ) => void;
}

const SaveDeckInput: React.FC<SaveDeckInputProps> = ({ onSave }) => {
    const [course, setCourse] = useState<string>('');
    const [lesson, setLesson] = useState<string>('');
    const [deck, setDeck] = useState<string>('');
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [decks, setDecks] = useState<string[]>([]);
    const [expanded, setExpanded] = useState(false);
    const [initialSave, setInitialSave] = useState(false);

    const [showCourseDropdown, setShowCourseDropdown] = useState(false);
    const [showLessonDropdown, setShowLessonDropdown] = useState(false);
    const [showDeckDropdown, setShowDeckDropdown] = useState(false);

    const getCourses = async (): Promise<Course[]> => {
        try {
            const response = await fetch('http://localhost:3000/api/courses/paginated?&page=1&limit=10');
            const data = await response.json();
            return data.courses;
        } catch (error) {
            console.error('Error fetching courses:', error);
            return [];
        }
    };

    useEffect(() => {
        const fetchCourses = async () => {
            const fetchedCourses = await getCourses();
            setCourses(fetchedCourses);
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        if (course) {
            const selectedCourse = courses.find((c) => c.name === course);
            if (selectedCourse) {
                setLessons(selectedCourse.lessons);
            } else {
                setLessons([]);
            }
        }
    }, [course, courses]);

    useEffect(() => {
        if (lesson) {
            const selectedLesson = lessons.find((l) => l.name === lesson);
            if (selectedLesson) {
                const allDecks = [
                    ...selectedLesson.kanjiDecks,
                    ...selectedLesson.grammarDecks,
                    ...selectedLesson.wordDecks
                ]
                    .map((deck) =>
                        deck.name.replace(/ - (Words|Kanji|Grammar)$/, '')
                    )
                    .filter((name, index, self) => self.indexOf(name) === index);

                setDecks(allDecks);
            } else {
                setDecks([]);
            }
        }
    }, [lesson, lessons]);
    
    
    const handleSave = async () => {
        if (!initialSave) {
            setExpanded(true);
            setInitialSave(true);
            return;
        }

        if (!deck) {
            setError('The "Deck" field is required.');
            return;
        }
        if (course && !lesson) {
            setError('If a Course is provided, a Lesson is required.');
            return;
        }
        if (!course && lesson) {
            setError('If a Lesson is provided, a Course is required.');
            return;
        }

        setError(null);

        // Buscar el curso por nombre
        const selectedCourse = courses.find((c) => c.name === course);

        // Buscar la lección por nombre dentro del curso, si el curso existe

        // Llamar a la función onSave con los nombres y el ID del curso (si existe)
        if (course && lesson && deck) {
            await onSave(
                selectedCourse?._id || null, // Pasar el ID del curso si existe
                course.trim(),
                lesson.trim(),
                deck.trim()
            );
            setSaved(true);
        }
    };

    const getContextMessage = () => {
        if (course) {
            const selectedCourse = courses.find((c) => c.name === course);
            if (!selectedCourse) {
                return `The Course "${course}" will be created.`;
            } else if (lesson) {
                const selectedLesson = selectedCourse.lessons.find((l) => l.name === lesson);
                if (!selectedLesson) {
                    return `The Lesosn "${lesson}" will be added to the Course "${course}".`;
                } else if (deck) {
                    if (!decks.includes(deck)) {
                        return `The deck "${deck}" will be added to the Lesson "${lesson}".`;
                    } else {
                        return `The content will be added to the existing Deck "${deck}".`;
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
                    value={course}
                    onChange={setCourse}
                    placeholder="Course"
                    options={courses.map((course) => course.name)}
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
                    value={lesson}
                    onChange={setLesson}
                    placeholder="Lesson"
                    options={lessons.map((lesson) => lesson.name)}
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
                    value={deck}
                    onChange={setDeck}
                    placeholder="Deck"
                    options={decks}
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