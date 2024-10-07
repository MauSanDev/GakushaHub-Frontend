import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa'; 

interface InstitutionMemberElementProps {
    pictureUrl?: string;
    name: string;
    role: string;
    isPending?: boolean;
    onRemove: () => void; 
    onRoleChange: (newRole: string) => void; 
}

const InstitutionMemberElement: React.FC<InstitutionMemberElementProps> = ({
                                                                               pictureUrl,
                                                                               name,
                                                                               role,
                                                                               isPending = false,
                                                                               onRemove,
                                                                               onRoleChange
                                                                           }) => {
    const roleColors: { [key: string]: string } = {
        Master: 'dark:text-purple-500 text-purple-400',   
        Staff: 'dark:text-yellow-500 text-yellow-500',    
        Sensei: 'dark:text-blue-400 text-blue-400',   
        Student: 'dark:text-green-500 text-green-400',   
    };
    
    const [selectedRole, setSelectedRole] = useState<string>('');
    
    useEffect(() => {
        if (role) {
            setSelectedRole(role);
        }
    }, [role]);

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = event.target.value;
        setSelectedRole(newRole);
        onRoleChange(newRole);
    };

    return (
        <div className="flex items-center p-4 border-b border-gray-300 dark:border-gray-600 hover:dark:bg-gray-800 hover:bg-blue-100  transition-all">
            <img
                src={pictureUrl || 'https://via.placeholder.com/40'}
                alt={name}
                className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex-1">
                <p className="text-md font-bold text-gray-800 dark:text-gray-200">{name}</p>
            </div>

            {isPending && (
                <span className="italic text-gray-400 mr-4">Pending approval</span>
            )}

            <select
                value={selectedRole}
                onChange={handleRoleChange}
                className={`uppercase font-bold cursor-pointer mr-4 focus:outline-none bg-transparent ${roleColors[selectedRole]}`}
            >
                <option value="Master">Master</option>
                <option value="Staff">Staff</option>
                <option value="Sensei">Sensei</option>
                <option value="Student">Student</option>
            </select>

            <button
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 ml-4"
                title="Remove Member"
            >
                <FaTrash size={16} />
            </button>
        </div>
    );
};

export default InstitutionMemberElement;