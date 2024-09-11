import { Route, Routes, Navigate } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import UnderDevelopmentPage from './pages/UnderDevelopmentPage';
import CourseListPage from "./pages/CourseListPage.tsx";
import GrammarListPage from "./pages/GrammarListPage.tsx";
import CourseDetailPage from "./pages/CourseDetailsPage.tsx";
import GenerationsListPage from "./pages/GenerationsListPage.tsx";
import TextDisplayPage from "./pages/TextDisplayPage.tsx";
import SignInPage from "./pages/login/SignInPage.tsx";
import SignUpPage from "./pages/login/SignUpPage.tsx";
import NotificationScreen from "./pages/login/NotificationScreen.tsx";
import ForgotPasswordScreen from "./pages/login/ForgotPasswordScreen.tsx";
import PasswordResetScreen from "./pages/login/PasswordResetScreen.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import FullScreenLayout from "./layouts/FullScreenLayout.tsx";
import {LanguageProvider} from "./context/LanguageContext.tsx";
import PrivateRoute from "./layouts/PrivateLayout.tsx";
import FakeGenerationPage from "./components/Modals/GenerationPage.tsx";
import { useEffect } from 'react';
import {applyDarkMode} from "./components/DarkModeToggle.tsx";
import GrammarCreatePage from "./pages/GrammarCreatePage.tsx";

function App() {
    useEffect(() => {
        applyDarkMode();
    }, []); 
    
    
    return (
        <LanguageProvider>
            
            <Routes>
                <Route element={<FullScreenLayout/>}>
                    <Route path="/signin" element={<SignInPage/>}/>
                    <Route path="/signup" element={<SignUpPage/>}/>
                    <Route path="/forgot-password" element={<ForgotPasswordScreen/>}/>
                    <Route path="/reset" element={<PasswordResetScreen/>}/>
                    <Route path="/signinsuccess" element={<NotificationScreen message={'Sign in success. Please validate your account pressing the link you received in your email.'}/>}/>
                    <Route path="/accountvalidated" element={<NotificationScreen message={'Account validated successfully. Login to start using the service.'}/>}/>
                </Route>

                <Route element={<MainLayout/>}>
                    <Route path="/" element={<Navigate to="/search" replace/>}/>
                    <Route path="/search" element={<SearchPage/>}/>
                    <Route path="/grammar" element={<GrammarListPage/>}/>
                    <Route path="/generations" element={<GenerationsListPage/>}/>
                    <Route path="/generation/:elementId" element={<TextDisplayPage/>}/>
                    <Route path="*" element={<UnderDevelopmentPage/>}/>
                </Route>

                <Route element={<PrivateRoute/>}>
                    <Route path="/addGrammar" element={<GrammarCreatePage/>}/>
                    <Route path="/generate" element={<FakeGenerationPage/>}/>
                    <Route path="/courses" element={<CourseListPage/>}/>
                    <Route path="/courses/:courseId" element={<CourseDetailPage/>}/>
                    <Route path="/courses/:courseId/:lessonId" element={<CourseDetailPage/>}/>
                </Route>
                
                
            </Routes>
        </LanguageProvider>
    );
}

export default App;