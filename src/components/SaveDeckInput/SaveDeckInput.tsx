import React, { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';

interface SaveDeckInputProps {
    onSave: (courseName: string, lessonName: string, deckName: string) => void;
    getCourses: () => Promise<string[]>; // Función para obtener los cursos
    getLessons: (courseName: string) => Promise<string[]>; // Función para obtener las lecciones según el curso
    getDecks: () => Promise<string[]>; // Función para obtener los decks
}

const SaveDeckInput: React.FC<SaveDeckInputProps> = ({ onSave, getCourses, getLessons, getDecks }) => {
    const [course, setCourse] = useState<string>('');
    const [lesson, setLesson] = useState<string>('');
    const [deck, setDeck] = useState<string>('');
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [courses, setCourses] = useState<string[]>([]);
    const [lessons, setLessons] = useState<string[]>([]);
    const [decks, setDecks] = useState<string[]>([]);
    const [showCourseDropdown, setShowCourseDropdown] = useState(false);
    const [showLessonDropdown, setShowLessonDropdown] = useState(false);
    const [showDeckDropdown, setShowDeckDropdown] = useState(false);
    const [expanded, setExpanded] = useState(false); // Controla si los campos están expandidos
    const [initialSave, setInitialSave] = useState(false); // Controla la primera vez que se presiona "Save"

    useEffect(() => {
        // Obtener los cursos cuando se monta el componente
        const fetchCourses = async () => {
            const fetchedCourses = await getCourses();
            setCourses(fetchedCourses);
        };
        fetchCourses();
    }, [getCourses]);

    useEffect(() => {
        // Obtener las lecciones cuando se selecciona un curso
        if (course) {
            const fetchLessons = async () => {
                const fetchedLessons = await getLessons(course);
                setLessons(fetchedLessons);
            };
            fetchLessons();
        }
    }, [course, getLessons]);

    useEffect(() => {
        // Obtener los decks cuando se monta el componente
        const fetchDecks = async () => {
            const fetchedDecks = await getDecks();
            setDecks(fetchedDecks);
        };
        fetchDecks();
    }, [getDecks]);

    const handleSave = async () => {
        if (!initialSave) {
            // La primera vez que se presiona "Save", expande los campos
            setExpanded(true);
            setInitialSave(true);
            return;
        }

        // Validación
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

        setError(null); // Reset error if all is good

        if (course && lesson && deck) {
            await onSave(course.trim(), lesson.trim(), deck.trim());
            setSaved(true);
        }
    };

    return (
        <div className="flex items-center gap-4">
            {/* Input Fields para Course */}
            <div
                className={`relative transition-all duration-500 ${
                    expanded ? 'flex-grow w-20' : 'w-0'
                } overflow-hidden`}
            >
                <input
                    type="text"
                    value={course}
                    onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="Course"
                    className="focus:outline-none w-full text-sm p-2 placeholder-gray-500"
                    disabled={saved}
                    style={{ border: 'none' }}
                />
                {/* Dropdown de Cursos */}
                {showCourseDropdown && (
                    <ul className="absolute w-full bg-white rounded shadow-lg max-h-40 overflow-y-auto">
                        {courses.map((course, index) => (
                            <li
                                key={index}
                                onClick={() => {
                                    setCourse(course);
                                    setShowCourseDropdown(false);
                                }}
                                className="cursor-pointer hover:bg-gray-100 p-2"
                            >
                                {course}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <span className={`${expanded ? 'visible' : 'invisible'}`}>/</span>

            {/* Input Fields para Lesson */}
            <div
                className={`relative transition-all duration-500 ${
                    expanded ? 'flex-grow w-20' : 'w-0'
                } overflow-hidden`}
            >
                <input
                    type="text"
                    value={lesson}
                    onClick={() => setShowLessonDropdown(!showLessonDropdown)}
                    onChange={(e) => setLesson(e.target.value)}
                    placeholder="Lesson"
                    className="focus:outline-none w-full text-sm p-2 placeholder-gray-500"
                    disabled={saved}
                    style={{ border: 'none' }}
                />
                {/* Dropdown de Lecciones */}
                {showLessonDropdown && (
                    <ul className="absolute w-full bg-white rounded shadow-lg max-h-40 overflow-y-auto">
                        {lessons.map((lesson, index) => (
                            <li
                                key={index}
                                onClick={() => {
                                    setLesson(lesson);
                                    setShowLessonDropdown(false);
                                }}
                                className="cursor-pointer hover:bg-gray-100 p-2"
                            >
                                {lesson}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <span className={`${expanded ? 'visible' : 'invisible'}`}>/</span>

            {/* Input Fields para Deck */}
            <div
                className={`relative transition-all duration-500 ${
                    expanded ? 'flex-grow w-20' : 'w-0'
                } overflow-hidden`}
            >
                <input
                    type="text"
                    value={deck}
                    onClick={() => setShowDeckDropdown(!showDeckDropdown)}
                    onChange={(e) => setDeck(e.target.value)}
                    placeholder="Deck"
                    className="focus:outline-none w-full text-sm p-2 placeholder-gray-500"
                    disabled={saved}
                    style={{ border: 'none' }}
                />
                {/* Dropdown de Decks */}
                {showDeckDropdown && (
                    <ul className="absolute w-full bg-white rounded shadow-lg max-h-40 overflow-y-auto">
                        {decks.map((deck, index) => (
                            <li
                                key={index}
                                onClick={() => {
                                    setDeck(deck);
                                    setShowDeckDropdown(false);
                                }}
                                className="cursor-pointer hover:bg-gray-100 p-2"
                            >
                                {deck}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Botón de Save */}
            <button
                onClick={handleSave}
                className={`flex items-center justify-center px-4 py-2 rounded ${
                    saved ? 'bg-green-500 text-white cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                } transition-transform duration-300`}
                disabled={saved}
            >
                {saved ? 'Saved' : <FaSave />}
            </button>

            {/* Mensaje de Error */}
            {error && <p className="text-red-500 text-sm absolute mt-10">{error}</p>}
        </div>
    );
};

export default SaveDeckInput;