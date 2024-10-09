import React, { useState, useEffect, useRef } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import InstitutionMemberElement from './Components/InstitutionMemberElement.tsx';
import AddInstitutionMembersModal from './AddInstitutionMembersModal';

interface MemberData {
    _id: string;
    name: string;
    role: string;
    pictureUrl?: string;
    isPending?: boolean;
}

const InstitutionMembersPage: React.FC = () => {
    const [members, setMembers] = useState<MemberData[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState<boolean>(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const isLoading = false;

    useEffect(() => {
        const dummyMembers: MemberData[] = [
            { _id: '1', name: 'John Doe', role: 'Master', pictureUrl: 'https://via.placeholder.com/40', isPending: false },
            { _id: '2', name: 'Jane Smith', role: 'Staff', pictureUrl: 'https://via.placeholder.com/40', isPending: true },
            { _id: '3', name: 'Alice Johnson', role: 'Student', pictureUrl: 'https://via.placeholder.com/40', isPending: false }
        ];
        setMembers(dummyMembers);
    }, []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddMemberSuccess = () => {
        // Aquí puedes actualizar la lista de miembros después de que se agregue uno nuevo
        setIsAddMemberModalOpen(false);
        // Puedes agregar lógica aquí para actualizar los miembros tras agregar uno nuevo
    };

    return (
        <div ref={scrollContainerRef}
             className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">

            <LoadingScreen isLoading={isLoading} />

            <div className="lg:pl-0 pl-16 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-4xl mt-8 lg:mb-2 px-4">
                <div className="flex items-start mb-4 sm:mb-0">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 capitalize">
                        メンバー
                    </h1>
                </div>
            </div>

            <div className="w-full max-w-4xl flex flex-col text-left mt-12">

                <div className="flex items-center justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Search members..."
                        className="px-4 py-2 w-full lg:w-1/2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <button
                        className="flex justify-center text-center text-sm border dark:border-gray-700 rounded-full px-5 py-2 transition-all duration-300 transform lg:hover:scale-105 hover:shadow-md items-center gap-2 bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-blue-300 hover:text-white"
                        onClick={() => setIsAddMemberModalOpen(true)}
                    >
                        ＋ Add Members
                    </button>
                </div>

                <div>
                    {filteredMembers.length > 0 ? (
                        filteredMembers.map((member) => (
                            <InstitutionMemberElement
                                key={member._id}
                                name={member.name}
                                role={member.role}
                                isPending={member.isPending}
                                pictureUrl={member.pictureUrl}
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
                    onClose={() => setIsAddMemberModalOpen(false)}
                    onAddSuccess={handleAddMemberSuccess} // Manejar el éxito al agregar miembros
                />
            )}
        </div>
    );
};

export default InstitutionMembersPage;