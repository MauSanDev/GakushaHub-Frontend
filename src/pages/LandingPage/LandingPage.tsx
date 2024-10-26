import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RoadmapSection from './RoadmapSection';
import StudentFeaturesSection from "./StudentFeaturesSection";
import TeacherFeaturesSection from "./TeachersFeaturesSection";
import MissionSection from "./MissionSection";
import ObjectiveSection from "./ObjectiveSection";
import bgImage from '../../assets/bg-dark-mode.jpg';

const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
};

const LandingPage: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                const scrollTop = scrollContainerRef.current.scrollTop;
                const maxScroll = scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight;
                const newOpacity = Math.max(0.05, 0.2 - scrollTop / maxScroll);
                setOpacity(newOpacity);
            }
        };

        const container = scrollContainerRef.current;
        container?.addEventListener('scroll', handleScroll);

        return () => container?.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative w-full h-screen overflow-hidden text-white bg-gradient-to-b from-black to-[#010230]">
            {/* Div para la imagen de fondo con opacidad controlada */}
            <div
                style={{ backgroundImage: `url(${bgImage})`, opacity, transition: 'opacity 0.3s' }}
                className="absolute inset-0 w-full h-full bg-cover bg-center"
            ></div>

            <div className="overflow-y-auto h-full relative z-10" ref={scrollContainerRef}>
                <motion.section
                    className="relative flex flex-col items-center justify-center text-center py-36 px-6"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    transition={{ duration: 1 }}
                >
                    <h1 className="text-5xl font-bold mb-6">
                        Manabu Mori (まなぶもり・学ぶ森)
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mb-8">
                        Manabu Mori es una plataforma todo-en-uno para el aprendizaje del japonés, combinando diccionarios, tarjetas
                        didácticas, ejercicios con IA, y mucho más, para estudiantes y profesores de todos los niveles.
                    </p>
                    <motion.button
                        className="px-8 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2 }}
                    >
                        Comienza ahora
                    </motion.button>
                </motion.section>

                <ObjectiveSection />
                <StudentFeaturesSection />
                <TeacherFeaturesSection />
                <MissionSection />
                <RoadmapSection />

                <footer className="relative bg-gray-800 text-white text-center py-12">
                    <div className="max-w-4xl mx-auto">
                        <p>© {new Date().getFullYear()} Manabu Mori - Aprende japonés de manera centralizada y avanzada.</p>
                        <p className="mt-2 text-sm text-gray-400">
                            Contáctanos en <a href="mailto:info@manabumori.com" className="text-blue-400">info@manabumori.com</a>
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;