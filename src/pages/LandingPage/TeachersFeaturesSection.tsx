import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChalkboardTeacher, FaCalendarAlt, FaFolderOpen, FaEdit, FaUsers } from 'react-icons/fa';
import {SectionTemplate} from "./SectionTemplate.tsx";
import missionImage from '../../assets/pc-mobile.webp';

const teacherFeatures = [
    { icon: <FaChalkboardTeacher />, title: 'Gestión de Clases', description: 'Organiza y monitorea tus clases en un solo lugar.' },
    { icon: <FaCalendarAlt />, title: 'Calendario de Clases', description: 'Administra horarios y fechas importantes con facilidad.' },
    { icon: <FaFolderOpen />, title: 'Recursos Compartidos', description: 'Comparte materiales y recursos con tus alumnos.' },
    { icon: <FaEdit />, title: 'Creación de Contenido', description: 'Crea contenido exclusivo asistido por IA para tus alumnos.' },
    { icon: <FaUsers />, title: 'Gestión de Alumnos', description: 'Administra alumnos, realiza seguimientos y organiza grupos.' },
];

const TeacherFeaturesSection: React.FC = () => {
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
    const [hovered, setHovered] = useState(false); // Estado para controlar si el usuario está haciendo hover
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!hovered) { 
            const interval = setInterval(() => {
                const nextIndex = (currentIndex + 1) % teacherFeatures.length;
                setSelectedFeature(teacherFeatures[nextIndex].title);
                setCurrentIndex(nextIndex);
            }, 3000);
            return () => clearInterval(interval); 
        }
    }, [hovered, currentIndex]);

    const handleMouseEnter = (title: string, index: number) => {
        setSelectedFeature(title);
        setHovered(true);
        setCurrentIndex(index);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    return (
        <section className="flex flex-col md:flex-row py-20 px-6 text-white max-w-5xl mx-auto">
            {/* Lista de características a la izquierda */}
            <div className="md:w-1/2 flex flex-col space-y-6">
                <motion.h2
                    className="text-4xl font-bold mb-8 text-center md:text-left"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8 }}
                >
                    Para Profesores
                </motion.h2>
                <p className="text-lg text-gray-300 mb-12 text-center md:text-left">
                    Herramientas avanzadas para gestionar tus clases, alumnos y contenido de manera centralizada y efectiva.
                </p>

                {teacherFeatures.map((feature, index) => (
                    <motion.div
                        key={index}
                        onMouseEnter={() => handleMouseEnter(feature.title, index)}
                        onMouseLeave={handleMouseLeave}
                        className={`flex items-center bg-white bg-opacity-10 rounded-lg p-4 shadow-lg transition transform 
                                    ${selectedFeature === feature.title ? 'scale-105 bg-opacity-20' : ''}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                        <div className="text-blue-400 text-3xl mr-4">
                            {feature.icon}
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                            <p className="text-gray-300 text-sm">{feature.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Contenedor de imágenes a la derecha */}
            <div className="md:w-1/2 flex items-center justify-center mt-10 md:mt-0">
                {selectedFeature ? (
                    <SectionTemplate className={'h-full'}>
                        <h3 className="text-2xl font-bold text-white">{selectedFeature}</h3>
                        <img src={missionImage} alt={selectedFeature}/>
                    </SectionTemplate>
                ) : (
                    <motion.div
                        className="flex items-center justify-center w-64 h-64 bg-gray-700 rounded-lg shadow-lg"
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 0.8 }}
                    >
                        <p className="text-lg text-gray-400">Selecciona una característica</p>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default TeacherFeaturesSection;