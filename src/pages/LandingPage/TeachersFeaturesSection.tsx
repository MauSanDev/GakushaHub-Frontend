import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChalkboardTeacher, FaCalendarAlt, FaFolderOpen, FaEdit, FaUsers } from 'react-icons/fa';
import { SectionTemplate } from "./SectionTemplate";
import missionImage from '../../assets/pc-mobile.webp';
import LocSpan from "../../components/LocSpan";
import {FaMessage} from "react-icons/fa6";

const teacherFeatures = [
    { icon: <FaChalkboardTeacher />, titleKey: 'landingPage.teacherFeaturesSection.featureTitle1', descriptionKey: 'landingPage.teacherFeaturesSection.featureDescription1' },
    { icon: <FaCalendarAlt />, titleKey: 'landingPage.teacherFeaturesSection.featureTitle2', descriptionKey: 'landingPage.teacherFeaturesSection.featureDescription2' },
    { icon: <FaFolderOpen />, titleKey: 'landingPage.teacherFeaturesSection.featureTitle3', descriptionKey: 'landingPage.teacherFeaturesSection.featureDescription3' },
    { icon: <FaEdit />, titleKey: 'landingPage.teacherFeaturesSection.featureTitle4', descriptionKey: 'landingPage.teacherFeaturesSection.featureDescription4' },
    { icon: <FaMessage />, titleKey: 'landingPage.teacherFeaturesSection.featureTitle5', descriptionKey: 'landingPage.teacherFeaturesSection.featureDescription5' },
    { icon: <FaUsers />, titleKey: 'landingPage.teacherFeaturesSection.featureTitle6', descriptionKey: 'landingPage.teacherFeaturesSection.featureDescription6' },
];

const TeacherFeaturesSection: React.FC<{id: string}> = ({id}) => {
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
    const [hovered, setHovered] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!hovered) {
            const interval = setInterval(() => {
                const nextIndex = (currentIndex + 1) % teacherFeatures.length;
                setSelectedFeature(teacherFeatures[nextIndex].titleKey);
                setCurrentIndex(nextIndex);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [hovered, currentIndex]);

    const handleMouseEnter = (titleKey: string, index: number) => {
        setSelectedFeature(titleKey);
        setHovered(true);
        setCurrentIndex(index);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    return (
        <section className="flex flex-col md:flex-row py-20 px-6 text-white max-w-5xl mx-auto" id={id}>
            <div className="md:w-1/2 flex flex-col space-y-2">
                <motion.h2
                    className="text-4xl font-bold mb-8 text-center md:text-left"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8 }}
                >
                    <LocSpan textKey="landingPage.teacherFeaturesSection.title" />
                </motion.h2>
                <p className="text-lg text-gray-300 mb-12 text-center md:text-left">
                    <LocSpan textKey="landingPage.teacherFeaturesSection.description" />
                </p>

                {teacherFeatures.map((feature, index) => (
                    <motion.div
                        key={index}
                        onMouseEnter={() => handleMouseEnter(feature.titleKey, index)}
                        onMouseLeave={handleMouseLeave}
                        className={`flex items-center bg-white bg-opacity-10 rounded-lg p-4 shadow-lg transition transform 
                                    ${selectedFeature === feature.titleKey ? 'scale-105 bg-opacity-20' : ''}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                        <div className="text-blue-400 text-3xl mr-4">
                            {feature.icon}
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-xl font-semibold text-white">
                                <LocSpan textKey={feature.titleKey} />
                            </h3>
                            <p className="text-gray-300 text-sm">
                                <LocSpan textKey={feature.descriptionKey} />
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="md:w-1/2 flex items-center justify-center mt-10 md:mt-0">
                {selectedFeature ? (
                    <SectionTemplate className={'h-full'}>
                        <h3 className="text-2xl font-bold text-white">
                            <LocSpan textKey={selectedFeature} />
                        </h3>
                        <img src={missionImage} alt={selectedFeature} />
                    </SectionTemplate>
                ) : (
                    <motion.div
                        className="flex items-center justify-center w-64 h-64 bg-gray-700 rounded-lg shadow-lg"
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 0.8 }}
                    >
                        <p className="text-lg text-gray-400">
                            <LocSpan textKey="landingPage.teacherFeaturesSection.selectFeaturePrompt" />
                        </p>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default TeacherFeaturesSection;