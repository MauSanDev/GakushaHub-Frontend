import React, { useState } from 'react';
import SectionContainer from "../../components/ui/containers/SectionContainer";
import Tabs from "../../components/ui/toggles/Tabs";
import InstitutionResourcesTab from "./Components/InstitutionResourcesTab";
import InstitutionResourcesGroupTab from "./Components/InstitutionResourcesGroupTab";
import {FaFolder} from "react-icons/fa";
import {useParams} from "react-router-dom";

const InstitutionResourcesPage: React.FC = () => {
    const { institutionId } = useParams<{ institutionId: string }>();
    const [currentTab, setCurrentTab] = useState('resources');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleTabChange = (view: string) => {
        setCurrentTab(view);
    };

    const tabs = [
        { label: 'Resources', view: 'resources', icon: <FaFolder /> },
        { label: 'Resource Groups', view: 'resourceGroups', icon: <FaFolder /> },
    ];

    const renderTabContent = () => {
        switch (currentTab) {
            case 'resources':
                return (
                    <InstitutionResourcesTab
                        institutionId={institutionId as string}
                        onOpenModal={handleOpenModal}
                        isModalOpen={isModalOpen}
                        handleCloseModal={handleCloseModal}
                    />
                );
            case 'resourceGroups':
                return <InstitutionResourcesGroupTab />;
            default:
                return null;
        }
    };

    return (
        <SectionContainer title={"リソース"}>
            <div className="w-full max-w-4xl mx-auto mt-6">
                <div className="mb-4">
                    <Tabs tabs={tabs} onTabChange={handleTabChange} currentTab={currentTab} />
                </div>

                {renderTabContent()}
            </div>
        </SectionContainer>
    );
};

export default InstitutionResourcesPage;