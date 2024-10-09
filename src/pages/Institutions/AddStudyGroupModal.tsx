import React, { useState } from 'react';
import ModalWrapper from '../ModalWrapper'; // Asumo que ya tienes un componente para manejar modales

interface AddStudyGroupModalProps {
    onClose?: () => void;
    onAddSuccess?: () => void;
}

const AddStudyGroupModal: React.FC<AddStudyGroupModalProps> = ({ onClose, onAddSuccess }) => {
    const [groupName, setGroupName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleAddGroup = () => {
        if (groupName.trim() === '') {
            setError('Group name cannot be empty.');
            return;
        }

        // Aquí podrías agregar la lógica para crear un grupo de estudio
        console.log("Study group to add:", groupName);

        if (onAddSuccess) {
            onAddSuccess();
        }

        if (onClose) {
            onClose();
        }
    };

    return (
        <ModalWrapper onClose={onClose}>
            <div className="relative p-6 w-full mt-2 rounded-lg shadow-md text-left border-2 transform transition-transform duration-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <h2 className="text-2xl font-bold mb-4 text-blue-900 dark:text-white text-center">Add New Study Group</h2>

                <div className="mb-4">
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => {
                            setGroupName(e.target.value);
                            setError(null); // Clear error when typing
                        }}
                        placeholder="Enter study group name"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleAddGroup}
                        className="inline-flex w-full justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-400 dark:bg-blue-800 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Add Group
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default AddStudyGroupModal;