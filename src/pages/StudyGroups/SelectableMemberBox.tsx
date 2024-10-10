import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { MembershipData, MembershipStatus } from '../../data/Institutions/MembershipData.ts';

interface SelectableMemberBoxProps {
    member: MembershipData;
    isSelected: boolean;
    onSelectMember: (member: MembershipData) => void;
    onDeselectMember: (member: MembershipData) => void;
}

const SelectableMemberBox: React.FC<SelectableMemberBoxProps> = ({ member, isSelected, onSelectMember, onDeselectMember }) => {
    const toggleSelection = () => {
        if (isSelected) {
            onDeselectMember(member);
        } else {
            onSelectMember(member);
        }
    };

    const isRegisteredUser = !!member.userId;

    // Mapeamos los roles con colores para mostrarlos
    const roleColors: { [key: string]: string } = {
        owner: 'text-purple-500',
        staff: 'text-yellow-500',
        sensei: 'text-blue-400',
        student: 'text-green-500',
    };

    return (
        <div
            onClick={toggleSelection}
            className={`flex items-center p-4 border-b border-gray-300 dark:border-gray-600 cursor-pointer transition-all 
            ${isSelected ? 'bg-blue-50 dark:bg-gray-800 border-blue-400' : 'hover:bg-blue-100 dark:hover:bg-gray-800'}`}
        >
            <img
                src={isRegisteredUser ? 'https://via.placeholder.com/40' : 'https://via.placeholder.com/40?text=?'}
                alt={isRegisteredUser ? member.userId?.name : member.email}
                className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex-1">
                {isRegisteredUser ? (
                    <p className="text-md font-bold text-gray-800 dark:text-gray-200">
                        {member.userId?.name} <span className="pl-4 text-sm text-gray-500 font-normal">{member.email}</span>
                    </p>
                ) : (
                    <p className="text-md font-bold text-gray-800 dark:text-gray-200">{member.email}</p>
                )}
            </div>

            {member.status === MembershipStatus.Pending && (
                <span className="italic text-gray-400 mr-4">Pending approval</span>
            )}

            {member.status === MembershipStatus.Rejected && (
                <span className="italic text-red-400 mr-4">Rejected</span>
            )}

            {/* Mostrar el rol del miembro */}
            <span className={`uppercase font-bold ml-4 ${roleColors[member.role]}`}>
                {member.role}
            </span>
            
            {isSelected && (
                <FaCheckCircle className="text-green-500" size={16} />
            )}
        </div>
    );
};

export default SelectableMemberBox;