import React, { useState } from 'react';
import ModalWrapper from '../ModalWrapper';
import { useCreateStudyGroup } from '../../hooks/institutionHooks/useCreateStudyGroup';
import Container from "../../components/ui/containers/Container.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import InputField from "../../components/ui/inputs/InputField";
import TextArea from "../../components/ui/inputs/TextArea";
import SelectionToggle from "../../components/ui/toggles/SelectionToggle.tsx";
import LocSpan from "../../components/LocSpan.tsx";
import ModalTitle from "../../components/ui/text/ModalTitle.tsx";

interface CreateStudyGroupModalProps {
    institutionId: string;
    onClose: () => void;
    onCreateSuccess?: () => void;
}

const AddStudyGroupModal: React.FC<CreateStudyGroupModalProps> = ({ institutionId, onClose, onCreateSuccess }) => {
    const [groupName, setGroupName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [useTimeBased, setUseTimeBased] = useState<boolean>(false); // Para habilitar o no fechas
    const [selectedTabs, setSelectedTabs] = useState<string[]>([]); // Para gestionar tabs seleccionadas
    const [error, setError] = useState<string | null>(null);

    const { mutate: createStudyGroup, isLoading } = useCreateStudyGroup();

    const handleCreateStudyGroup = () => {
        if (groupName.trim() === '') {
            setError("Study group name cannot be empty.");
            return;
        }

        if (useTimeBased && startDate && endDate) {
            if (new Date(startDate) > new Date(endDate)) {
                setError("Start date cannot be later than end date.");
                return;
            }
            if (new Date(endDate) < new Date()) {
                setError("End date cannot be earlier than today.");
                return;
            }
        }

        createStudyGroup(
            { institutionId, groupName, description, startDate, endDate, selectedTabs },
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

    const handleTabToggle = (tab: string) => {
        if (selectedTabs.includes(tab)) {
            setSelectedTabs(selectedTabs.filter(t => t !== tab));
        } else {
            setSelectedTabs([...selectedTabs, tab]);
        }
    };

    return (
        <ModalWrapper onClose={onClose}>
            <Container className={"w-full"}>
                <ModalTitle title={"institution.studyGroupKeys.createNewGroup"} className="text-center pb-4" />

                <InputField
                    id="groupName"
                    value={groupName}
                    onChange={(e) => {
                        setGroupName(e.target.value);
                        setError(null); // Clear error when typing
                    }}
                    placeholder="title"
                    disabled={isLoading}
                    error={error}
                />

                {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}

                <TextArea
                    id="groupDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="addDescriptionPlaceholder"
                    disabled={isLoading}
                    error={error}
                    rows={4}
                />

                {/* Toggle para habilitar fechas */}
                <div className="my-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={useTimeBased}
                            onChange={() => setUseTimeBased(!useTimeBased)}
                        />
                        <LocSpan textKey={"institution.studyGroupKeys.timeBased"} className={'text-sm text-gray-400 dark:text-gray-500'} />
                    </label>
                </div>

                {useTimeBased && (
                    <div className="flex gap-4">
                        <InputField
                            id="startDate"
                            type="date"
                            value={startDate || ''}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="Start Date"
                            disabled={isLoading}
                        />
                        <InputField
                            id="endDate"
                            type="date"
                            value={endDate || ''}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder="End Date"
                            disabled={isLoading}
                        />
                    </div>
                )}

                <div className="mt-4">
                    <LocSpan textKey={"institution.studyGroupKeys.optionalFeatures"} className={'text-sm text-gray-400 dark:text-gray-500'} />
                    <div className="flex flex-wrap gap-2">
                        {['schedule', 'chat', 'homework'].map(tab => (
                            <SelectionToggle
                                key={tab}
                                isSelected={selectedTabs.includes(tab)}
                                onToggle={() => handleTabToggle(tab)}
                                textKey={tab}
                            />
                        ))}
                    </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 my-4"><LocSpan textKey={"institution.studyGroupKeys.changeLater"} /></p>

                <PrimaryButton
                    label="create"
                    onClick={handleCreateStudyGroup}
                    disabled={isLoading || groupName.trim() === ''}
                    className="w-full"
                />
            </Container>
        </ModalWrapper>
    );
};

export default AddStudyGroupModal;