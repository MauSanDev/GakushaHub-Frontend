import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {FaInfoCircle, FaCalendarAlt, FaNewspaper} from 'react-icons/fa';
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import { useInstitutionById } from "../../hooks/institutionHooks/useInstitutionById.ts";
import { useCachedImage } from "../../hooks/newHooks/Resources/useCachedImage.ts";
import Tabs from "../../components/ui/toggles/Tabs";
import ScheduleCalendar from "./Components/ScheduleCalendar.tsx";
import InstitutionProfileNewsTab from "./InstitutionProfileNewsTab.tsx";
import manabuMoriBanner from '../../assets/banner_placeholder.jpg'


const InstitutionProfilePage: React.FC = () => {
    const { institutionId } = useParams<{ institutionId: string }>();
    const { data, isLoading, fetchInstitution } = useInstitutionById(institutionId || "");
    const [currentTab, setCurrentTab] = useState<string>('news');
    const [links, setLinks] = useState<string[]>([]);

    const { imageUrl: profileImage } = useCachedImage({
        path: `institutions/${institutionId}/profileImage`,
    });

    const { imageUrl: bannerImage } = useCachedImage({
        path: `institutions/${institutionId}/bannerImage`,
        defaultImage: manabuMoriBanner,
    });

    useEffect(() => {
        fetchInstitution();
    }, [fetchInstitution]);

    useEffect(() => {
        if (data?.links) {
            setLinks([...data.links]);
        }
    }, [data?.links]);

    const handleTabChange = (view: string) => {
        setCurrentTab(view);
    };

    const tabs = [
        { label: 'news', view: 'news', icon: <FaNewspaper /> },
        { label: 'schedule', view: 'schedule', icon: <FaCalendarAlt /> },
        { label: 'info', view: 'information', icon: <FaInfoCircle /> },
    ];

    const renderTabContent = () => {
        if (currentTab === 'information') {
            return (
                <div className="flex flex-col lg:flex-row justify-center w-full max-w-4xl mx-auto mt-6">

                    <div className={`flex-1 text-gray-800 dark:text-white px-10 ${links.length === 0 ? 'text-center' : ''}`}>
                        <p className="mt-2 text-gray-400">
                            {data?.description || 'No description available'}
                        </p>
                    </div>

                    {links.length > 0 && (
                        <div className="flex-1 ml-8">
                            <h3 className="text-lg font-bold mb-4 text-white">Social Links</h3>
                            {links.map((link, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <a
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:text-blue-700 text-sm"
                                    >
                                        {link}
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        } else if (currentTab === 'schedule') {
            return (
                <div className="mt-10">
                    <ScheduleCalendar institutionId={institutionId || ''} canEdit={false} institutionView={false}/>
                </div>
            );
        } else if (currentTab === 'news') {
            return (
                <div className="mt-10">
                    <InstitutionProfileNewsTab />
                </div>
            );
        }
    };

    return (
        <SectionContainer isLoading={isLoading}>
            <div className="w-full flex flex-col gap-2 py-1 overflow-y-auto h-full pb-80"
                 style={{maxHeight: 'calc(100vh)'}}>
                
                {/* Banner */}
                <div className="relative w-full h-48 bg-gray-300 rounded-md mb-8 group">
                    <img
                        src={bannerImage}
                        alt="Banner"
                        className="object-cover w-full h-full rounded-md"
                    />
                </div>

                <div className="relative -mt-20 mb-8 group">
                    <img
                        src={profileImage}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover shadow-lg border-4 dark:border-black border-white mx-auto"
                    />
                </div>

                <h2 className="text-center text-white text-3xl font-bold mb-4">
                    {data?.name || 'Institution Name'}
                </h2>

                <div className="w-full lg:w-auto lg:flex lg:flex-row gap-2">
                    <Tabs tabs={tabs} onTabChange={handleTabChange} currentTab={currentTab}/>
                </div>

                {/* Tab Content */}
                <div className="w-full max-w-4xl flex flex-grow flex-col gap-6 text-left pb-24 text-white">
                    {renderTabContent()}
                </div>
            </div>
        </SectionContainer>
);
};

export default InstitutionProfilePage;