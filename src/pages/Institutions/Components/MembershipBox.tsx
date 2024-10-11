import React, { useState } from 'react';
import { MembershipData, MembershipStatus, MembershipRole } from '../../../data/Institutions/MembershipData.ts';
import { useChangeMembershipStatus } from '../../../hooks/institutionHooks/useChangeMembershipStatus';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Container from "../../../components/ui/containers/Container.tsx";
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton.tsx";

interface MembershipBoxProps {
    membership: MembershipData;
    canEditRole: boolean; // Nueva prop para manejar la edición del rol
}

const roleColors: { [key: string]: string } = {
    owner: 'text-purple-400 dark:text-purple-500',
    staff: 'text-yellow-500 dark:text-yellow-500',
    sensei: 'text-blue-400 dark:text-blue-400',
    student: 'text-green-500 dark:text-green-400',
};

const MembershipBox: React.FC<MembershipBoxProps> = ({ membership, canEditRole }) => {
    const { mutate: changeStatus } = useChangeMembershipStatus();
    const [selectedRole, setSelectedRole] = useState<MembershipRole>(membership.role);

    const handleAccept = () => {
        changeStatus({
            membershipId: membership._id,
            newStatus: 'approved',
        });
    };

    const handleReject = () => {
        changeStatus({
            membershipId: membership._id,
            newStatus: 'rejected',
        });
    };

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = event.target.value as MembershipRole;
        setSelectedRole(newRole);
        // Aquí puedes disparar alguna lógica si deseas cambiar el rol al backend
    };

    return (
        <Container className="w-full max-w-4xl my-2">
            <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {membership.institutionId?.name || 'Unknown Institution'}
                    {/* Si se puede editar el rol, mostrar un dropdown, de lo contrario, solo el texto */}
                    {canEditRole ? (
                        <select
                            value={selectedRole}
                            onChange={handleRoleChange}
                            className={`ml-2 bg-transparent font-bold uppercase ${roleColors[selectedRole]}`}
                        >
                            <option value="owner">Master</option>
                            <option value="staff">Staff</option>
                            <option value="sensei">Sensei</option>
                            <option value="student">Student</option>
                        </select>
                    ) : (
                        <span className={`ml-2 ${roleColors[membership.role]}`}>({membership.role})</span>
                    )}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {membership.institutionId?.description || 'No description available'}
                </p>
            </div>

            {/* Botones para aceptar o rechazar si el estado es pending */}
            {membership.status === MembershipStatus.Pending ? (
                <div className="flex gap-2 mt-2 sm:mt-0 justify-end">
                    <p className="text-sm text-yellow-500 mt-2">
                        You received this membership.
                    </p>

                    <PrimaryButton
                        onClick={handleAccept}
                        label="accept"
                        className="text-xs w-40 bg-green-500 hover:bg-green-600 dark:bg-green-500 hover:dark:bg-green-600"
                        iconComponent={<FaCheck />}
                    />
                    <PrimaryButton
                        onClick={handleReject}
                        label="reject"
                        className="text-xs w-40 bg-red-500 hover:bg-red-600 dark:bg-red-600 hover:dark:bg-red-600"
                        iconComponent={<FaTimes />}
                    />
                </div>
            ) : (
                <div className="mt-2 sm:mt-0 flex justify-end">
                    <PrimaryButton className="w-40" label="enter" onClick={() => {}} />
                </div>
            )}
        </Container>
    );
};

export default MembershipBox;