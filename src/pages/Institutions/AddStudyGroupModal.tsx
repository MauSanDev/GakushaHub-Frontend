import React, { useState } from 'react';
import ModalWrapper from '../ModalWrapper';
import { useCreateStudyGroup } from '../../hooks/institutionHooks/useCreateStudyGroup';

interface CreateStudyGroupModalProps {
    institutionId: string;
    onClose?: () => void;
    onCreateSuccess?: () => void;
}

const AddStudyGroupModal: React.FC<CreateStudyGroupModalProps> = ({ institutionId, onClose, onCreateSuccess }) => {
    const [groupName, setGroupName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const { mutate: createStudyGroup, isLoading } = useCreateStudyGroup();

    const handleCreateStudyGroup = () => {
        if (groupName.trim() === '') {
            setError("Study group name cannot be empty.");
            return;
        }

        createStudyGroup(
            { institutionId, groupName, description },
            {
                onSuccess: () => {
                    setError(null);
                    if (onCreateSuccess) {
                        onCreateSuccess();
                    }
                    if (onClose) {
                        onClose();
                    }
                },
                onError: (error: any) => {
                    setError(error.message || "Error creating study group.");
                },
            }
        );
    };

    return (
        <ModalWrapper onClose={onClose}>
            <div className="relative p-6 w-full mt-2 rounded-lg shadow-md text-left border-2 transform transition-transform duration-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <h2 className="text-2xl font-bold mb-4 text-blue-900 dark:text-white text-center">
                    Create a New Study Group
                </h2>

                <div className="mb-4">
                    <input
                        type="text"
                        id="groupName"
                        value={groupName}
                        onChange={(e) => {
                            setGroupName(e.target.value);
                            setError(null); // Clear error when typing
                        }}
                        placeholder="Study group name"
                        disabled={isLoading}
                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 ${
                            error ? 'border-red-500' : ''
                        }`}
                    />
                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                </div>

                <div className="mb-4">
                    <textarea
                        id="groupDescription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        disabled={isLoading}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                        rows={4}
                    />
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">(You will be able to change these values later)</p>

                <div className="flex justify-center">
                    <button
                        onClick={handleCreateStudyGroup}
                        disabled={isLoading || groupName.trim() === ''}
                        className={`inline-flex w-full justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-400 dark:bg-blue-800 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            isLoading || groupName.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default AddStudyGroupModal;