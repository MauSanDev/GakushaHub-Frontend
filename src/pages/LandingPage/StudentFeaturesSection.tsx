import React from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaClipboardList, FaPen, FaBrain, FaSpellCheck, FaLanguage, FaTasks, FaGlobe } from 'react-icons/fa';

const features = [
    { icon: <FaBook />, label: 'Flashcards' },
    { icon: <FaClipboardList />, label: 'Grammar' },
    { icon: <FaPen />, label: 'Kanji' },
    { icon: <FaBrain />, label: 'Words' },
    { icon: <FaSpellCheck />, label: 'IA' },
    { icon: <FaLanguage />, label: 'Tests' },
    { icon: <FaTasks />, label: 'Practices' },
    { icon: <FaGlobe />, label: 'Readings' },
];

const StudentFeaturesSection: React.FC<{id: string}> = ({id}) => {
    return (
        <motion.section
            className="flex flex-col md:flex-row items-center md:items-start justify-center py-20 px-6 text-white max-w-4xl mx-auto" id={id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            {/* Texto a la izquierda */}
            <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0 md:pr-10">
                <h2 className="text-4xl font-bold mb-8">Para Estudiantes</h2>
                <p className="text-lg text-gray-300 max-w-md">
                    Herramientas centralizadas para que cada estudiante pueda mejorar su japonés con inteligencia artificial.
                    Descubre funcionalidades como flashcards, correcciones con IA, diccionario de kanji y pruebas de gramática, todo en un solo lugar.
                </p>
            </div>

            {/* Contenedor de scroll infinito vertical */}
            
            <div className="md:w-2/3 h-80 overflow-hidden relative group border rounded-2xl border-gray-900 p-4  shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                {/* Efecto de fade out en la parte superior e inferior */}
                <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>

                {/* Contenedor de scroll continuo sin salto */}
                <motion.div
                    className="flex flex-col space-y-4 transform transition-transform duration-300 group-hover:scale-105"
                    animate={{ y: [0, -1000] }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                >
                    {/* Duplicamos las features para el efecto de scroll continuo */}
                    {[...features, ...features].map((feature, index) => (
                        <div
                            key={index}
                            className="flex items-center bg-white bg-opacity-10 rounded-lg p-4 shadow-lg min-w-[150px] hover:bg-opacity-20 transition"
                        >
                            <div className="text-blue-400 mr-4 text-2xl">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-white">{feature.label}</h3>
                        </div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
};

export default StudentFeaturesSection;