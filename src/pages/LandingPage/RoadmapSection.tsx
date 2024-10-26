import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import { SectionTemplate } from "./SectionTemplate";
import LocSpan from "../../components/LocSpan";

const roadmapData = [
    { dateKey: "landingPage.roadmapSection.target1", descKey: "landingPage.roadmapSection.target1desc", completed: false },
    { dateKey: "landingPage.roadmapSection.target2", descKey: "landingPage.roadmapSection.target2desc", completed: false },
    { dateKey: "landingPage.roadmapSection.target3", descKey: "landingPage.roadmapSection.target3desc", completed: false },
    { dateKey: "landingPage.roadmapSection.target4", descKey: "landingPage.roadmapSection.target4desc", completed: true },
    { dateKey: "landingPage.roadmapSection.target5", descKey: "landingPage.roadmapSection.target5desc", completed: true },
    { dateKey: "landingPage.roadmapSection.target6", descKey: "landingPage.roadmapSection.target6desc", completed: true },
    { dateKey: "landingPage.roadmapSection.target7", descKey: "landingPage.roadmapSection.target7desc", completed: true },
];

const RoadmapSection: React.FC<{id: string}> = ({id}) => {
    return (
        <section className="relative py-20 px-6 text-white" id={id}>
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                    <LocSpan textKey="landingPage.roadmapSection.title" />
                </h2>
                <p className="text-gray-300 text-lg">
                    <LocSpan textKey="landingPage.roadmapSection.description" />
                </p>
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
                                <LocSpan textKey={item.dateKey} />
                            </h3>
                            <p className={`mt-2 ${item.completed ? 'text-gray-500 line-through' : 'text-gray-400'}`}>
                                <LocSpan textKey={item.descKey} />
                            </p>
                        </motion.div>
                    ))}
                </div>
            </SectionTemplate>
        </section>
    );
};

export default RoadmapSection;