import React from 'react';
import {useNavigate} from 'react-router-dom';
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton.tsx";
import RoundedTag from "../../../components/ui/text/RoundedTag.tsx";
import {useCachedImage} from '../../../hooks/newHooks/Resources/useCachedImage.ts';
import {MembershipRole} from "../../../data/MembershipData.ts";

interface MyInstitutionProps {
    institutionId: string;
    institutionName?: string;
    institutionDescription?: string;
    userRole?: MembershipRole;
}

const InstitutionBox: React.FC<MyInstitutionProps> = ({
                                                          institutionId,
                                                          institutionName,
                                                          institutionDescription,
                                                          userRole = MembershipRole.Owner
                                                      }) => {
    const isOwner = userRole === MembershipRole.Owner;
    const navigate = useNavigate();

    const { imageUrl: institutionImage } = useCachedImage({
        path: `institutions/${institutionId}/profileImage`,});

    return (
        <div className="w-full max-w-4xl my-4">
            <div
                className={`relative flex items-center p-6 rounded-lg shadow-md transition-all 
                    ${isOwner ? 'bg-green-100 dark:bg-green-900 dark:bg-opacity-30 border-2 border-green-500 dark:border-green-700 dark:hover:border-green-500 hover:border-green-400' : 'dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-gray-600'}`}
            >
                <img
                    src={institutionImage}
                    alt="Institution"
                    className="w-24 h-24 sm:w-40 sm:h-40 rounded-lg object-cover mr-6 dark:bg-gray-900"
                />

                <RoundedTag textKey={`institution.membershipTypes.${userRole}`} className={`absolute top-2 right-2 ${isOwner ? 'bg-green-600 dark:bg-green-700' : 'bg-blue-400 dark:bg-gray-600'}`} />

                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        {institutionName || 'Institution Name'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {institutionDescription || 'Institution Description'}
                    </p>

                    <div className="mt-4 flex justify-end">
                        <PrimaryButton className={"w-40"} label={"institution.editSchool"} onClick={() => {
                            navigate(`/institution/${institutionId}/studyGroups`);
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstitutionBox;