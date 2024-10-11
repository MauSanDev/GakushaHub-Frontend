import React, { useState } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import InstitutionMemberElement from './Components/InstitutionMemberElement.tsx';
import AddInstitutionMembersModal from './AddInstitutionMembersModal';
import { useParams } from 'react-router-dom';
import { usePaginatedMembers } from '../../hooks/institutionHooks/usePaginatedMembers.ts';
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import SecondaryButton from "../../components/ui/buttons/SecondaryButton.tsx";
import {FaPlus} from "react-icons/fa";

const InstitutionMembersPage: React.FC = () => {
    const { institutionId } = useParams<{ institutionId: string }>();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState<boolean>(false);

    const { data: membersData, error, isLoading } = usePaginatedMembers(1, 10, institutionId || '');

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleAddMemberSuccess = () => {
        setIsAddMemberModalOpen(false);
    };
    
    const filteredMembers = membersData?.documents.filter((member) =>
        (member.userId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    if (isLoading) {
        return <LoadingScreen isLoading={isLoading} />;
    }

    if (error) {
        return <p className="text-center text-red-500">Error loading members</p>;
    }

    return (
        <SectionContainer title={"メンバー"} isLoading={isLoading} >

            <div className="w-full max-w-4xl flex flex-col text-left mt-12">
                <div className="flex items-center justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Search members..."
                        className="px-4 py-2 w-full lg:w-1/2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <SecondaryButton onClick={() => setIsAddMemberModalOpen(true)} label={"addMember"} IconComponent={<FaPlus />} />
                </div>

                <div>
                    {filteredMembers.length > 0 ? (
                        filteredMembers.map((member) => (
                            <InstitutionMemberElement
                                key={member._id}
                                member={member}
                                onRemove={() => {}}
                                onRoleChange={() => {}}
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-500">誰もいない</p>
                    )}
                </div>
            </div>

            {isAddMemberModalOpen && (
                <AddInstitutionMembersModal
                    institutionId={institutionId || ""}
                    onClose={() => setIsAddMemberModalOpen(false)}
                    onAddSuccess={handleAddMemberSuccess}
                />
            )}

        </SectionContainer>
    );
};

export default InstitutionMembersPage;