import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import SearchPage from './pages/SearchPage/SearchPage.tsx';
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
import LicenseSelectionPage from "./pages/login/LicenseSelectionPage.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import FullScreenLayout from "./layouts/FullScreenLayout.tsx";
import {LanguageProvider} from "./context/LanguageContext.tsx";
import PrivateRoute from "./layouts/PrivateLayout.tsx";
import FakeGenerationPage from "./components/Modals/GenerationPage.tsx";
import { applyDarkMode } from "./components/DarkModeToggle.tsx";
import GrammarCreatePage from "./pages/GrammarCreatePage.tsx";
import InstitutionListPage from "./pages/Institutions/InstitutionListPage.tsx";
import InstitutionDataPage from "./pages/Institutions/InstitutionDataPage.tsx";
import InstitutionRoute from "./layouts/InstitutionLayout.tsx";
import InstitutionCourseListPage from "./pages/Institutions/InstitutionCourseListPage.tsx";
import InstitutionMembersPage from "./pages/Institutions/InstitutionMembersPage.tsx";
import InstitutionStudyGroupList from "./pages/Institutions/InstitutionStudyGroupList.tsx";
import InstitutionProfileEditionPage from "./pages/Institutions/InstitutionProfileEditionPage.tsx";
import StudyGroupContentPage from "./pages/StudyGroupContentPage.tsx";
import MyStudyGroupsPage from "./pages/MyStudyGroupsPage.tsx";

function App() {
    const { isAuthenticated, hasLicense } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        applyDarkMode();
    }, []);

    useEffect(() => {
        if (isAuthenticated && !hasLicense) {
            navigate('/license');
        }
    }, [hasLicense, navigate]);

    return (
        <LanguageProvider>
            <Routes>
                <Route element={<FullScreenLayout />}>
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
                    <Route path="/license" element={<LicenseSelectionPage />} />
                    <Route path="/reset" element={<PasswordResetScreen />} />
                    <Route path="/signinsuccess" element={<NotificationScreen message={'Sign in success. Please validate your account pressing the link you received in your email.'} />} />
                    <Route path="/accountvalidated" element={<NotificationScreen message={'Account validated successfully. Login to start using the service.'} />} />
                </Route>

                <Route element={<MainLayout />}>
                    <Route path="/" element={<Navigate to="/search" replace />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/grammar" element={<GrammarListPage />} />
                    <Route path="/groups" element={<MyStudyGroupsPage />} />
                    <Route path="/generations" element={<GenerationsListPage />} />
                    <Route path="/generation/:elementId" element={<TextDisplayPage />} />
                    <Route path="*" element={<UnderDevelopmentPage />} />
                    <Route path="/studyGroup/:studyGroupId" element={<StudyGroupContentPage />} />
                </Route>

                <Route element={<PrivateRoute />}>
                    <Route path="/addGrammar" element={<GrammarCreatePage />} />
                    <Route path="/generate" element={<FakeGenerationPage />} />
                    <Route path="/courses" element={<CourseListPage />} />
                    <Route path="/institutions" element={<InstitutionListPage />} />
                    <Route path="/courses/:courseId" element={<CourseDetailPage />} />
                    <Route path="/courses/:courseId/:lessonId" element={<CourseDetailPage />} />
                    <Route path="/studyGroup/:groupId" element={<StudyGroupContentPage />} />
                </Route>

                <Route element={<InstitutionRoute />}>
                    <Route path="institution/:institutionId/editProfile" element={<InstitutionProfileEditionPage />} />
                    <Route path="institution/:institutionId/institutionData" element={<InstitutionDataPage />} />
                    <Route path="institution/:institutionId/courses" element={<InstitutionCourseListPage />} />
                    <Route path="institution/:institutionId/members" element={<InstitutionMembersPage />} />
                    <Route path="institution/:institutionId/studyGroups" element={<InstitutionStudyGroupList />} />
                    <Route path="institution/:institutionId/courses/:courseId" element={<CourseDetailPage />} />
                    <Route path="institution/:institutionId/courses/:courseId/:lessonId" element={<CourseDetailPage />} />
                    <Route path="institution/:institutionId/studyGroup/:studyGroupId" element={<StudyGroupContentPage />} />
                </Route>
            </Routes>
        </LanguageProvider>
    );
}

export default App;