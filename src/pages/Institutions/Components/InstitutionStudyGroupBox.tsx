import React from 'react';
import { FaUser, FaChalkboardTeacher, FaBook, FaFolder } from 'react-icons/fa'; // Importamos los íconos necesarios

interface InstitutionStudyGroupProps {
    groupName?: string;
    groupDescription?: string;
    members?: number;
    teachers?: number;
    courses?: number;
    resources?: number;
}

const InstitutionStudyGroupBox: React.FC<InstitutionStudyGroupProps> = ({
                                                                            groupName,
                                                                            groupDescription,
                                                                            members = 0,
                                                                            teachers = 0,
                                                                            courses = 0,
                                                                            resources = 0,
                                                                        }) => {
    return (
        <div className="w-full max-w-4xl my-2">
            <div
                className={`relative flex items-center p-4 rounded-lg shadow-md transition-all dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-gray-600`}
            >
                <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                        {groupName || 'Study Group Name'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {groupDescription || 'Study Group Description'}
                    </p>

                    <div className="flex items-center justify-between mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {/* Íconos y números en una sola línea, oculta solo el texto en pantallas pequeñas */}
                        <div className="flex items-center gap-4">
                            <span className="flex items-center">
                                <FaUser className="mr-1" />
                                <span>{members}</span> {/* El número siempre visible */}
                                <span className="hidden sm:inline">Members</span> {/* El texto se oculta en pantallas pequeñas */}
                            </span>
                            <span className="flex items-center">
                                <FaChalkboardTeacher className="mr-1" />
                                <span>{teachers}</span> {/* El número siempre visible */}
                                <span className="hidden sm:inline">Teachers</span> {/* El texto se oculta en pantallas pequeñas */}
                            </span>
                            <span className="flex items-center">
                                <FaBook className="mr-1" />
                                <span>{courses}</span> {/* El número siempre visible */}
                                <span className="hidden sm:inline">Courses</span> {/* El texto se oculta en pantallas pequeñas */}
                            </span>
                            <span className="flex items-center">
                                <FaFolder className="mr-1" />
                                <span>{resources}</span> {/* El número siempre visible */}
                                <span className="hidden sm:inline">Resources</span> {/* El texto se oculta en pantallas pequeñas */}
                            </span>
                        </div>

                        {/* Botón de Enter */}
                        <div className="mt-2 sm:mt-0 flex justify-end">
                            <button className="px-8 py-1 bg-blue-500 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-600  hover:dark:bg-blue-600 transition-all">
                                Enter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstitutionStudyGroupBox;