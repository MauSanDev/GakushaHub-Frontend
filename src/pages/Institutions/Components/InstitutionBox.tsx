import React from 'react';
import { Link } from 'react-router-dom';

interface MyInstitutionProps {
    institutionId: string;
    institutionName?: string;
    institutionDescription?: string;
    members?: number;
    groups?: number;
    resources?: number;
    userRole?: string;
}

const InstitutionBox: React.FC<MyInstitutionProps> = ({
                                                          institutionId,
                                                          institutionName,
                                                          institutionDescription,
                                                          members = 0,
                                                          groups = 0,
                                                          resources = 0,
                                                          userRole = 'member'
                                                      }) => {
    const isOwner = userRole === 'owner';

    return (
        <div className="w-full max-w-4xl my-4">
            <div
                className={`relative flex items-center p-6 rounded-lg shadow-md transition-all 
                    ${isOwner ? 'bg-green-100 dark:bg-green-900 dark:bg-opacity-30 border-2 border-green-500 dark:border-green-700 dark:hover:border-green-500 hover:border-green-400' : 'dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-gray-600'}`}
            >
                <div className="w-24 h-24 sm:w-40 sm:h-40 bg-gray-300 rounded-lg mr-6 dark:bg-gray-900"></div>

                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        {institutionName || 'Institution Name'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {institutionDescription || 'Institution Description'}
                    </p>
                    <div className="text-gray-500 dark:text-gray-400 mt-2">
                        {members} Members - {groups} Groups - {resources} Resources
                    </div>

                    <div className="mt-4 flex justify-end">

                        <Link
                            to={`/institution/${institutionId}/editProfile`}
                            className="px-12 py-1 bg-blue-500 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-600  hover:dark:bg-blue-600 transition-all">
                            Enter
                        </Link>
                    </div>
                </div>

                <span className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full ${isOwner ? 'bg-green-600 dark:bg-green-700' : 'bg-blue-400 dark:bg-gray-600'}`}>
                    {userRole}
                </span>
            </div>
        </div>
    );
};

export default InstitutionBox;