import React from 'react';
import missionImage from '../../assets/pc-mobile.webp';
import LocSpan from '../../components/LocSpan';

const ObjectiveSection: React.FC<{ id: string }> = ({ id }) => {
    return (
        <section
            className="flex flex-col items-center text-center md:text-left py-20 px-6 text-white max-w-4xl mx-auto"
            id={id}
        >
            <h2 className="text-4xl font-bold mb-8">
                <LocSpan textKey="landingPage.objectiveTitle" />
            </h2>
            <p className="text-lg text-gray-300">
                <LocSpan textKey="landingPage.objectiveDescription" />
            </p>

            <div className="flex justify-center">
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