import React, { useState } from 'react';
import { StudyGroupData } from "../../data/Institutions/StudyGroupData.ts";
import { useUpdateData } from '../../hooks/updateHooks/useUpdateData.ts';
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import SelectionToggle from "../../components/ui/toggles/SelectionToggle.tsx";
import InputField from "../../components/ui/inputs/InputField.tsx";
import {CollectionTypes} from "../../data/CollectionTypes.tsx";

interface StudyGroupSettingsProps {
    studyGroup: StudyGroupData;
    canEdit: boolean;
}

const sectionOptions = [
    { label: 'schedule', view: 'schedule' },
    { label: 'chat', view: 'chat' },
    { label: 'homework', view: 'homework' },
];

const StudyGroupSettings: React.FC<StudyGroupSettingsProps> = ({ studyGroup, canEdit }) => {
    const { mutate: updateDocument } = useUpdateData<Partial<StudyGroupData>>();
    const [viewsEnabled, setViewsEnabled] = useState<string[]>(studyGroup.viewsEnabled || []);
    const [fromDate, setFromDate] = useState<string>(studyGroup.fromDate ? new Date(studyGroup.fromDate).toISOString().slice(0, 10) : '');
    const [toDate, setToDate] = useState<string>(studyGroup.toDate ? new Date(studyGroup.toDate).toISOString().slice(0, 10) : '');
    const [isActive, setIsActive] = useState<boolean>(studyGroup.isActive);

    const handleToggleView = (view: string) => {
        setViewsEnabled((prevViews) =>
            prevViews.includes(view) ? prevViews.filter(v => v !== view) : [...prevViews, view]
        );
    };

    const handleSave = () => {
        if (!canEdit) return;

        const updatedData = {
            isActive,
            viewsEnabled,
            fromDate: fromDate || null,
            toDate: toDate || null,
        };

        updateDocument({
            collection: CollectionTypes.StudyGroup,
            documentId: studyGroup._id,
            newData: updatedData,
        });
    };
    

    return (
        <div className="flex flex-col items-center overflow-y-scroll m-4 pb-80">
            <div className="flex flex-col items-end w-full max-w-3xl mt-4">
                <SelectionToggle
                    isSelected={!isActive}
                    onToggle={() => setIsActive(!isActive)}
                    textKey={"Archive"}
                />
            </div>
            
            <div className="flex flex-col items-start w-full max-w-3xl mt-4">
                <h3 className="text-lg font-semibold mb-2">Enabled Sections:</h3>
                <div className="grid grid-cols-4 gap-4">
                    {sectionOptions.map((section) => (
                        <SelectionToggle
                            key={section.view}
                            isSelected={viewsEnabled.includes(section.view)}
                            onToggle={() => handleToggleView(section.view)}
                            textKey={section.label}
                        />
                    ))}
                </div>
            </div>


            {/* Date Inputs */}
            <div className="flex flex-col items-start w-full max-w-3xl mt-4">
                <h3 className="text-lg font-semibold mb-2">Course Dates:</h3>
                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        id="fromDate"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        placeholder="Start Date"
                        type="date"
                        className="w-full"
                    />
                    <InputField
                        id="toDate"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        placeholder="End Date"
                        type="date"
                        className="w-full"
                    />
                </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-center w-full max-w-3xl mt-6">
                <PrimaryButton
                    label="Save"
                    onClick={handleSave}
                    disabled={!canEdit}
                    className="w-full"
                />
            </div>
        </div>
    );
};

export default StudyGroupSettings;