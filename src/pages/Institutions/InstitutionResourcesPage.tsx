import React, {useEffect, useState} from 'react';
import SectionContainer from "../../components/ui/containers/SectionContainer";
import Tabs from "../../components/ui/toggles/Tabs";
import InstitutionResourcesTab from "./Components/InstitutionResourcesTab";
import InstitutionResourcesGroupTab from "./Components/InstitutionResourcesGroupTab";
import {FaFolder, FaLayerGroup } from "react-icons/fa";
import {useParams} from "react-router-dom";
import {MembershipRole} from "../../data/MembershipData.ts";
import {useAuth} from "../../context/AuthContext.tsx";

const InstitutionResourcesPage: React.FC = () => {
    const { institutionId } = useParams<{ institutionId: string }>();
    const [currentTab, setCurrentTab] = useState('resources');
    const [role, setRole] = useState<MembershipRole>();
    const { getRole } = useAuth();
    
    useEffect(() => {
        const fetchUserRole = async () => {
            const fetchedRole = await getRole(institutionId || "", "");
            setRole(fetchedRole);
        };

        fetchUserRole();
    }, [getRole]);
    
    const handleTabChange = (view: string) => {
        setCurrentTab(view);
    };

    const tabs = [
        { label: 'resources', view: 'resources', icon: <FaFolder /> },
        { label: 'resourcesGroups', view: 'resourceGroups', icon: <FaLayerGroup /> },
    ];

    const renderTabContent = () => {
        switch (currentTab) {
            case 'resources':
                return (
                    <InstitutionResourcesTab institutionId={institutionId as string} role={role as MembershipRole} />
                );
            case 'resourceGroups':
                return <InstitutionResourcesGroupTab institutionId={institutionId as string} role={role as MembershipRole} />;
            default:
                return null;
        }
    };

    return (
        <SectionContainer title={"リソース"}>
            <div className="w-full max-w-4xl mx-auto mt-6">
                <div className="mb-4 w-full lg:w-auto lg:flex lg:flex-row gap-2">
                    <Tabs tabs={tabs} onTabChange={handleTabChange} currentTab={currentTab} />
                </div>

                {renderTabContent()}
            </div>
        </SectionContainer>
    );
};

export default InstitutionResourcesPage;