import React from 'react';
import missionImage from '../../assets/pc-mobile.webp';

const ObjectiveSection: React.FC = () => {
    return (
        <section className="flex flex-col items-center text-center md:text-left py-20 px-6 text-white max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8">Nuestro Objetivo</h2>
            <p className="text-lg text-gray-300 mb-8">
                En Manabu Mori, nuestro objetivo es ofrecer una solución de estudio todo-en-uno que centralice todas las necesidades
                de estudiantes y profesores en el aprendizaje del japonés. Creamos una plataforma fácil de usar, rápida y accesible
                desde cualquier dispositivo, eliminando la necesidad de depender de múltiples aplicaciones.
            </p>

            <div className="flex justify-center -mt-24">
                <img
                    src={missionImage}
                    alt="Manabu Mori en dispositivos"
                    className="w-full rounded-lg shadow-lg"
                />
            </div>
        </section>
    );
};

export default ObjectiveSection;