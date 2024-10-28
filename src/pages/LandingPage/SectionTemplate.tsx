import React from 'react';
import { motion, Variants } from 'framer-motion';

const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
};

interface SectionTemplateProps {
    children: React.ReactNode;
    className?: string; // Para agregar clases adicionales si es necesario
}

export const SectionTemplate: React.FC<SectionTemplateProps> = ({ children, className = "" }) => (
    <motion.section
        className={`relative px-6 text-white rounded-lg shadow-lg  ${className}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={defaultVariants}
        transition={{ duration: 0.8, ease: "easeInOut" }}
    >
        <div className={`max-w-5xl mx-auto relative text-center py-10 px-6 bg-opacity-80 rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.1)]`}>
            {children}
        </div>
    </motion.section>
);