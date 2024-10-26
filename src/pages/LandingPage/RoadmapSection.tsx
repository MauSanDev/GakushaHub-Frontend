import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import {SectionTemplate} from "./SectionTemplate.tsx";

const roadmapData = [
    { date: "Q3 2024", title: "Lanzamiento Completo", description: "Lanzamiento completo de la plataforma con todas las funcionalidades.", completed: false },
    { date: "Q2 2024", title: "Generación de Contenidos con IA", description: "Soporte para generación de contenidos de estudio mediante IA.", completed: false },
    { date: "Q1 2024", title: "Sistema de Gamificación", description: "Añadir elementos de gamificación como puntos y logros para motivar el aprendizaje.", completed: false },
    { date: "Q4 2023", title: "Plataforma para Profesores", description: "Funcionalidades especiales para que los profesores puedan gestionar sus clases y alumnos.", completed: true },
    { date: "Q3 2023", title: "Corrección de Textos con IA", description: "Integración de inteligencia artificial para corrección de textos escritos.", completed: true },
    { date: "Q2 2023", title: "Funcionalidad de Flashcards", description: "Implementación de decks de flashcards para vocabulario y kanji.", completed: true },
    { date: "Q1 2023", title: "Lanzamiento de Beta", description: "Lanzamiento de la versión beta de la plataforma para un grupo limitado de usuarios.", completed: true },
];

const RoadmapSection: React.FC = () => {
    return (
        
        <section className="relative py-20 px-6 text-white">
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Roadmap</h2>
                <p className="text-gray-300 text-lg">Nuestro plan de desarrollo para ofrecer una experiencia cada vez más completa.</p>
            </div>

        <SectionTemplate>
            <div className="relative max-w-4xl mx-auto border-l-2 border-gray-700">
                {roadmapData.map((item, index) => (
                    <motion.div
                        key={index}
                        className="mb-10 ml-8"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        <motion.div
                            className={`absolute -left-4 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                item.completed ? 'bg-green-500 border-green-500' : 'bg-blue-500 border-gray-700'
                            }`}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: [1, 1.3, 1], transition: { duration: 1.5, repeat: Infinity, delay: index * 0.2 }}}
                        >
                            {item.completed && <FaCheck className="text-white text-xs" />}
                        </motion.div>

                        <h3 className={`text-xl font-semibold ${item.completed ? 'text-gray-400' : 'text-white'}`}>
                            {item.date} - {item.title}
                        </h3>
                        <p className={`mt-2 ${item.completed ? 'text-gray-500 line-through' : 'text-gray-400'}`}>
                            {item.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </SectionTemplate>
        </section>
    );
};

export default RoadmapSection;