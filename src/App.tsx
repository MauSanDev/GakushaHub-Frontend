import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SearchPage from './pages/SearchPage';
import KanjiListPage from './pages/KanjiListPage.tsx';
import UnderDevelopmentPage from './pages/UnderDevelopmentPage';
import WordListPage from "./pages/WordListPage.tsx";
import CourseListPage from "./pages/CourseListPage.tsx";
import GrammarListPage from "./pages/GrammarListPage.tsx";
import LanguageDropdown from './components/LanguageDropdown';
import { LanguageProvider } from './context/LanguageContext';
import CourseDetailPage from "./pages/CourseDetailsPage.tsx";
import GenerationsListPage from "./pages/GenerationsListPage.tsx";
import GenerationPage from "./pages/GenerationPage.tsx";
import TextDisplayPage from "./pages/TextDisplayPage.tsx";

function App() {
    const location = useLocation();

    return (
        <LanguageProvider>
            <div className="flex h-screen w-full">
                <Sidebar />

                <div className="fixed top-2 left-2 z-50">
                    <LanguageDropdown />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center relative">
                    <div
                        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out`}
                    >
                        <Routes location={location}>
                            <Route path="/" element={<Navigate to="/search" replace />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/kanji" element={<KanjiListPage />} />
                            <Route path="/words" element={<WordListPage />} />
                            <Route path="/grammar" element={<GrammarListPage />} />
                            <Route path="/generations" element={<GenerationsListPage />} />
                            <Route path="/generate" element={<GenerationPage />} />
                            <Route path="/courses" element={<CourseListPage />} />
                            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
                            <Route path="/generation/:elementId" element={<TextDisplayPage />} />
                            <Route path="*" element={<UnderDevelopmentPage />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </LanguageProvider>
    );
}

export default App;