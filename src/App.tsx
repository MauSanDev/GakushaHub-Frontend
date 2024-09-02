import { Route, Routes, Navigate } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import KanjiListPage from './pages/KanjiListPage.tsx';
import UnderDevelopmentPage from './pages/UnderDevelopmentPage';
import WordListPage from "./pages/WordListPage.tsx";
import CourseListPage from "./pages/CourseListPage.tsx";
import GrammarListPage from "./pages/GrammarListPage.tsx";
import CourseDetailPage from "./pages/CourseDetailsPage.tsx";
import GenerationsListPage from "./pages/GenerationsListPage.tsx";
import GenerationPage from "./pages/GenerationPage.tsx";
import TextDisplayPage from "./pages/TextDisplayPage.tsx";
import LoginScreen from "./pages/login/LoginScreen.tsx";
import NotificationScreen from "./pages/login/NotificationScreen.tsx";
import ForgotPasswordScreen from "./pages/login/ForgotPasswordScreen.tsx";
import PasswordResetScreen from "./pages/login/PasswordResetScreen.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import FullScreenLayout from "./layouts/FullScreenLayout.tsx";
import {LanguageProvider} from "./context/LanguageContext.tsx";
import LanguageDropdown from "./components/LanguageDropdown";

function App() {
    return (
        <LanguageProvider>

            <div className="fixed top-2 left-2 z-50">
                <LanguageDropdown/>
            </div>
            
            <Routes>
                <Route element={<FullScreenLayout/>}>
                    <Route path="/login" element={<LoginScreen/>}/>
                    <Route path="/forgot-password" element={<ForgotPasswordScreen/>}/>
                    <Route path="/reset" element={<PasswordResetScreen/>}/>
                    <Route path="/notif" element={<NotificationScreen message={'confirmed'}/>}/>
                </Route>

                <Route element={<MainLayout/>}>
                    <Route path="/" element={<Navigate to="/search" replace/>}/>
                    <Route path="/search" element={<SearchPage/>}/>
                    <Route path="/kanji" element={<KanjiListPage/>}/>
                    <Route path="/words" element={<WordListPage/>}/>
                    <Route path="/grammar" element={<GrammarListPage/>}/>
                    <Route path="/generations" element={<GenerationsListPage/>}/>
                    <Route path="/generate" element={<GenerationPage/>}/>
                    <Route path="/courses" element={<CourseListPage/>}/>
                    <Route path="/courses/:courseId" element={<CourseDetailPage/>}/>
                    <Route path="/generation/:elementId" element={<TextDisplayPage/>}/>
                    <Route path="*" element={<UnderDevelopmentPage/>}/>
                </Route>
            </Routes>
        </LanguageProvider>
    );
}

export default App;