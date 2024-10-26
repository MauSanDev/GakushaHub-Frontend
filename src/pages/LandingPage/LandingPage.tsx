import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from 'react-icons/fa';
import RoadmapSection from './RoadmapSection';
import StudentFeaturesSection from "./StudentFeaturesSection";
import TeacherFeaturesSection from "./TeachersFeaturesSection";
import MissionSection from "./MissionSection";
import ObjectiveSection from "./ObjectiveSection";
import bgImage from '../../assets/bg-dark-mode.jpg';
import appScreenshot from '../../assets/app-screenshot.png';
import LanguageDropdown from "../../components/LanguageDropdown";
import LocSpan from '../../components/LocSpan';

const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
};

const LandingPage: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [opacity, setOpacity] = useState(0.3);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleScrollToSection = (id: string) => {
        const section = document.getElementById(id);
        section?.scrollIntoView({ behavior: 'smooth' });
        setMenuOpen(false); // Cierra el menú después de hacer clic
    };

    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                const scrollTop = scrollContainerRef.current.scrollTop;
                const maxScroll = scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight;
                const newOpacity = Math.max(0.05, 0.3 - scrollTop / maxScroll);
                setOpacity(newOpacity);
            }
        };

        const container = scrollContainerRef.current;
        container?.addEventListener('scroll', handleScroll);

        return () => container?.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative w-full h-screen overflow-hidden text-white bg-gradient-to-b from-black to-[#010230]">
            {/* Imagen de fondo con opacidad controlada */}
            <div
                style={{ backgroundImage: `url(${bgImage})`, opacity, transition: 'opacity 0.3s' }}
                className="absolute inset-0 w-full h-full bg-cover bg-center"
            ></div>

            {/* Header de navegación flotante */}
            <header
                className="fixed top-4 left-1/2 transform -translate-x-1/2 py-3 px-10 rounded-lg bg-gray-500 bg-opacity-10 backdrop-blur-md z-20 shadow-md flex space-x-2 items-center w-full max-w-6xl justify-between">
                <h1 className="text-xl font-bold text-white">
                    <LocSpan textKey="landingPage.title" />
                </h1>

                {/* Menú hamburguesa para pantallas pequeñas */}
                <div className={'w-32'}>
                    <LanguageDropdown/>
                </div>
                <button className="md:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes/> : <FaBars/>}
                </button>

                {/* Navegación para pantallas grandes */}
                <nav className="hidden md:flex space-x-4 text-gray-400 text-sm">
                    <button onClick={() => handleScrollToSection('objective')}
                            className="hover:text-blue-500 transition">
                        <LocSpan textKey="landingPage.objective" />
                    </button>
                    <button onClick={() => handleScrollToSection('students')}
                            className="hover:text-blue-500 transition">
                        <LocSpan textKey="landingPage.forStudents" />
                    </button>
                    <button onClick={() => handleScrollToSection('teachers')}
                            className="hover:text-blue-500 transition">
                        <LocSpan textKey="landingPage.forTeachers" />
                    </button>
                    <button onClick={() => handleScrollToSection('mission')} className="hover:text-blue-500 transition">
                        <LocSpan textKey="landingPage.mission" />
                    </button>
                    <button onClick={() => handleScrollToSection('roadmap')} className="hover:text-blue-500 transition">
                        <LocSpan textKey="landingPage.roadmap" />
                    </button>
                    <Link to={'/signup'}
                          className="px-4 py-1 bg-blue-700 text-white rounded-full font-semibold hover:bg-blue-600 transition">
                        <LocSpan textKey="landingPage.getStarted" />
                    </Link>
                    <Link to={"/signin"}
                          className="px-4 py-1 bg-gray-700 text-white rounded-full font-semibold hover:bg-blue-600 transition">
                        <LocSpan textKey="landingPage.logIn" />
                    </Link>
                </nav>
            </header>

            {/* Overlay y menú responsive */}
            {menuOpen && (
                <div className="fixed inset-0 z-30 bg-black bg-opacity-80 flex flex-col items-center justify-center text-center space-y-8 text-lg font-semibold text-white transition-transform transform">
                    {/* Botón de cierre en la esquina superior derecha */}
                    <button
                        className="absolute top-4 right-4 text-white text-3xl"
                        onClick={() => setMenuOpen(false)}
                    >
                        <FaTimes />
                    </button>

                    <nav className="flex flex-col space-y-6">
                        <button onClick={() => handleScrollToSection('objective')} className="hover:text-blue-400 transition">
                            <LocSpan textKey="landingPage.objective" />
                        </button>
                        <button onClick={() => handleScrollToSection('students')} className="hover:text-blue-400 transition">
                            <LocSpan textKey="landingPage.forStudents" />
                        </button>
                        <button onClick={() => handleScrollToSection('teachers')} className="hover:text-blue-400 transition">
                            <LocSpan textKey="landingPage.forTeachers" />
                        </button>
                        <button onClick={() => handleScrollToSection('mission')} className="hover:text-blue-400 transition">
                            <LocSpan textKey="landingPage.mission" />
                        </button>
                        <button onClick={() => handleScrollToSection('roadmap')} className="hover:text-blue-400 transition">
                            <LocSpan textKey="landingPage.roadmap" />
                        </button>
                    </nav>
                    <div className="flex space-x-4 mt-8">
                        <Link to={'/signup'} className="px-6 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition">
                            <LocSpan textKey="landingPage.getStarted" />
                        </Link>
                        <Link to={"/signin"} className="px-6 py-2 bg-gray-700 text-white rounded-full font-semibold hover:bg-blue-600 transition">
                            <LocSpan textKey="landingPage.logIn" />
                        </Link>
                    </div>
                </div>
            )}

            <div className="overflow-y-auto h-full relative z-10" ref={scrollContainerRef}>
                {/* Sección Hero */}
                <motion.section
                    id="home"
                    className="relative flex flex-col items-center justify-center text-center py-36 px-6 space-y-6"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    transition={{ duration: 1 }}
                >
                    <h1
                        className="text-5xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg"
                        style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
                    >
                        <LocSpan textKey="landingPage.heroTitle" />
                    </h1>
                    <p className="text-lg text-gray-300 max-w-3xl mb-8">
                        <LocSpan textKey="landingPage.heroDescription" />
                    </p>

                    <div className="flex space-x-4 justify-center mt-8">
                        <Link to={'/signup'}>
                            <motion.button
                                className="px-8 py-3 bg-blue-700 text-white text-lg rounded-full font-semibold shadow-lg hover:bg-blue-600 transition transform hover:scale-105"
                                initial={{opacity: 0, scale: 0.9}}
                                animate={{opacity: 1, scale: 1}}
                                transition={{duration: 1.2}}
                            >
                                <LocSpan textKey="landingPage.getStarted" />
                            </motion.button>
                        </Link>

                        <Link to={'/signin'}>
                            <motion.button
                                className="px-8 py-3 bg-gray-700 text-white text-lg rounded-full font-semibold shadow-lg hover:bg-gray-600 transition transform hover:scale-105"
                                initial={{opacity: 0, scale: 0.9}}
                                animate={{opacity: 1, scale: 1}}
                                transition={{duration: 1.2}}
                            >
                                <LocSpan textKey="landingPage.logIn" />
                            </motion.button>
                        </Link>
                    </div>
                </motion.section>

                {/* Sección de imagen del app */}
                <motion.section
                    id="app-screenshot"
                    className="relative flex flex-col items-center justify-center text-center px-6 mb-12 space-y-6"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    transition={{ duration: 1 }}
                >
                    <img
                        src={appScreenshot}
                        alt="Manabu Mori en dispositivos"
                        className="max-w-4xl rounded-lg shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    />
                </motion.section>

                <ObjectiveSection id="objective" />
                <StudentFeaturesSection id="students" />
                <TeacherFeaturesSection id="teachers" />
                <MissionSection id="mission" />
                <RoadmapSection id="roadmap" />

                <footer className="relative bg-gray-950 text-white text-center py-12">
                    <div className="max-w-4xl mx-auto text-gray-300">
                        <p><LocSpan textKey="landingPage.footerText" /></p>
                        <p className="mt-2 text-sm text-gray-400">
                            <LocSpan textKey="landingPage.contactUs" /> <a href="mailto:maurosanchez.work@gmail.com" className="text-blue-400">maurosanchez.work@gmail.com</a>
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;