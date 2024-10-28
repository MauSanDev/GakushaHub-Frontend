import React from 'react';
import { motion } from 'framer-motion';
import { FaGlobe } from 'react-icons/fa';
import LocSpan from "../../components/LocSpan";  // Assuming LocSpan is located here

const MissionSection: React.FC<{id: string}> = ({id}) => {
    const points = [
        { top: '30%', left: '40%' },
        { top: '50%', left: '60%' },
        { top: '70%', left: '50%' },
        { top: '40%', left: '75%' },
        { top: '60%', left: '20%' },
    ];

    return (
        <motion.section
            className="relative flex flex-col items-center text-center py-20 px-6 to-black text-white max-w-4xl mx-auto" id={id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <h2 className="text-4xl font-bold mb-8">
                <LocSpan textKey="landingPage.missionSection.missionTitle" />
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl">
                <LocSpan textKey="landingPage.missionSection.missionDescription" />
            </p>

            {/* Animated Expansion Map with Points */}
            <div className="relative w-full h-64 max-w-xl bg-transparent overflow-hidden">
                <FaGlobe className="absolute w-full h-full opacity-10 text-gray-400" />

                {points.map((point, index) => (
                    <motion.div
                        key={index}
                        className="absolute w-4 h-4 bg-blue-500 rounded-full opacity-75 shadow-lg"
                        style={{ top: point.top, left: point.left }}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.5,
                        }}
                    />
                ))}
            </div>
        </motion.section>
    );
};

export default MissionSection;