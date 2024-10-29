import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext.tsx";
import UserMenu from '../../components/UserMenu';
import LocSpan from "../../components/LocSpan.tsx";
import { useInstitutionById } from "../../hooks/institutionHooks/useInstitutionById.ts";
import { MembershipRole } from "../../data/MembershipData.ts";
import {useCachedImage} from "../../hooks/newHooks/Resources/useCachedImage.ts";

const InstitutionSidebar: React.FC = () => {
    const { institutionId } = useParams<{ institutionId: string; }>();
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, getRole } = useAuth();
    const { data, fetchInstitution } = useInstitutionById(institutionId || "");
    const [role, setRole] = useState<MembershipRole | null>(null);

    const { imageUrl: profileImage } = useCachedImage({
        path: `institutions/${institutionId}/profileImage`,
    });

    useEffect(() => {
        fetchInstitution();
    }, [fetchInstitution]);

    useEffect(() => {
        const fetchRole = async () => {
            if (institutionId && data?.creatorId) {
                const userRole = await getRole(institutionId, data.creatorId);
                setRole(userRole);
            }
        };
        fetchRole();
    }, [institutionId, data, getRole]);

    const menuItems = [
        { label: 'editProfile', path: `/institution/${institutionId}/editProfile`, roles: [MembershipRole.Owner, MembershipRole.Staff] },
        { label: 'news', path: `/institution/${institutionId}/news`, roles: [MembershipRole.Owner, MembershipRole.Staff] },
        { label: 'studyGroups', path: `/institution/${institutionId}/studyGroups`, roles: null },
        { label: 'resources', path: `/institution/${institutionId}/resources`, roles: null },
        { label: 'members', path: `/institution/${institutionId}/members`, roles: null },
        { label: 'courses', path: `/institution/${institutionId}/courses`, roles: null },
        { label: 'schedule', path: `/institution/${institutionId}/schedule`, roles: null },
    ];

    return (
        <>
            <button
                className="lg:hidden fixed top-1 left-1 z-50 p-2 dark:text-white rounded text-3xl"
                onClick={() => setIsOpen(!isOpen)}
            >
                ☰
            </button>

            <div
                className={`pt-24 fixed lg:left-0 lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:w-32 hover:lg:w-64 lg:h-auto w-full h-full top-0 left-0 z-40 transition-all ${
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >


                <div
                    className="flex items-center space-x-4 p-4 dark:hover:text-white dark:text-gray-300 lg:w-64 w-full">
                    <div
                        className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-400 dark:border-gray-600">
                        <img src={profileImage} alt="Profile" className="object-cover w-full h-full"/>
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-bold">{data?.name}</span>
                        <div className="flex space-x-2 text-xs text-gray-400 hover:text-blue-400">
                            <Link
                                to="/institutions"
                                className=" hover:underline"
                            >
                                <LocSpan textKey={"goBack"}/>
                            </Link>
                            <span>|</span>
                            <Link
                                to={`/institution/${institutionId}`}
                                className=" hover:underline"
                            >
                                <LocSpan textKey={"seeProfile"}/>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="lg:hidden pl-2 ">
                    <UserMenu/>
                </div>

                <div className="flex flex-col p-4 space-y-4">
                    {menuItems.map((item, index) =>
                            (!item.roles || (role && item.roles.includes(role))) && isAuthenticated && (
                                <Link
                                    key={index}
                                    to={item.path}
                                    className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-400 hover:dark:text-white py-2 border-b border-gray-300 dark:border-gray-700 text-left hover:pl-2 transition-all"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <LocSpan textKey={item.label}/>
                                </Link>
                            )
                    )}

                </div>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-white dark:bg-black z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            <div className="hidden lg:block">
                <UserMenu />
            </div>
        </>
    );
};

export default InstitutionSidebar;