import { useState } from 'react';
import './App.css';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Sidebar from './components/Sidebar';
import SearchPage from './pages/SearchPage';
import KanjiListPage from './pages/KanjiListPage.tsx';
import UnderDevelopmentPage from './pages/UnderDevelopmentPage';
import WordListPage from "./pages/WordListPage.tsx";
import CourseListPage from "./pages/CourseListPage.tsx";
import GrammarListPage from "./pages/GrammarListPage.tsx";
import LanguageDropdown from './components/LanguageDropdown';
import { LanguageProvider } from './context/LanguageContext';
import CourseDetailPage from "./pages/CourseDetailsPage.tsx"; // Importa la nueva página de detalles del curso

function App() {
    const [activeSection, setActiveSection] = useState('Search');
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null); // Nuevo estado para el curso seleccionado
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');

    const handleCourseClick = (courseId: string) => {
        setSelectedCourseId(courseId); // Establece el ID del curso seleccionado
        setActiveSection('CourseDetail'); // Cambia la vista a la página de detalles del curso
    };

    const handleBackToCourses = () => {
        setSelectedCourseId(null); // Resetea el ID del curso seleccionado
        setActiveSection('Courses'); // Cambia de nuevo a la lista de cursos
    };

    return (
        <LanguageProvider>
            <div className="flex h-screen w-full">
                <Sidebar setActiveSection={setActiveSection} />

                <div className="fixed top-2 left-2 z-50">
                    <LanguageDropdown />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center relative">
                    <SwitchTransition mode="out-in">
                        <CSSTransition
                            key={activeSection}
                            timeout={150}
                            classNames="page-fade"
                        >
                            <div className="flex-1 flex flex-col items-center justify-center h-full w-full">
                                {activeSection === 'Search' && (
                                    <SearchPage
                                        tags={tags}
                                        setTags={setTags}
                                        inputValue={inputValue}
                                        setInputValue={setInputValue}
                                    />
                                )}
                                {activeSection === 'Kanjis' && <KanjiListPage />}
                                {activeSection === 'Words' && <WordListPage />}
                                {activeSection === 'Grammatical Structures' && <GrammarListPage />}
                                {activeSection === 'Courses' && (
                                    <CourseListPage onCourseClick={handleCourseClick} /> // Pasa la función de click al componente de cursos
                                )}
                                {activeSection === 'CourseDetail' && selectedCourseId && (
                                    <CourseDetailPage courseId={selectedCourseId} onBack={handleBackToCourses} /> // Pasa la función de volver al componente de detalles
                                )}
                                {(activeSection !== 'Search' && activeSection !== 'Kanjis' && activeSection !== 'Words') && (
                                    <UnderDevelopmentPage />
                                )}
                            </div>
                        </CSSTransition>
                    </SwitchTransition>
                </div>
            </div>
        </LanguageProvider>
    );
}

export default App;