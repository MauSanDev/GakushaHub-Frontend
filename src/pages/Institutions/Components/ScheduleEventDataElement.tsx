import React, { useState } from 'react';
import {FaClock, FaCalendarAlt, FaEdit, FaSave, FaTimes, FaTrash, FaSchool} from 'react-icons/fa';
import { ScheduleEventData } from "../../../data/ScheduleEventData.ts";
import { useSchedule } from "../../../hooks/newHooks/Courses/useSchedule.ts";
import { useAuth } from "../../../context/AuthContext.tsx";
import CreatorLabel from "../../../components/ui/text/CreatorLabel.tsx";
import {useTranslation} from "react-i18next";
import {useUpdateData} from "../../../hooks/updateHooks/useUpdateData.ts";
import {useDeleteElement} from "../../../hooks/useDeleteElement.ts";
import {CollectionTypes} from "../../../data/CollectionTypes.tsx";

interface ScheduleEventDataElementProps {
    index: number;
    eventData: ScheduleEventData;
    onSave: (index: number,  updatedEvent: ScheduleEventData) => void;
    onCancel: (index: number) => void;
    onDelete: (index: number) => void;
    isNew?: boolean;
    institutionId: string;
    studyGroupId?: string;
    canEdit: boolean;
}

const ScheduleEventDataElement: React.FC<ScheduleEventDataElementProps> = ({
                                                                               index,
                                                                               eventData,
                                                                               onSave,
                                                                               onCancel,
                                                                               onDelete,
                                                                               isNew = false,
                                                                               institutionId,
                                                                               studyGroupId,
                                                                               canEdit
                                                                           }) => {
    const { userData } = useAuth();
    const [isEditing, setIsEditing] = useState(isNew);
    const [editedEvent, setEditedEvent] = useState<ScheduleEventData>({
        ...eventData,
        name: isNew ? '' : eventData.name,
        desc: isNew ? '' : eventData.desc
    });

    const updateMutation = useUpdateData<ScheduleEventData>();
    const deleteMutation = useDeleteElement();
    const { createScheduleEvent, isCreating } = useSchedule(eventData.institutionId, eventData.timestamp, 1, 10, eventData.studyGroupId);
    const { t } = useTranslation();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'timestamp') {
            const isValidDate = !isNaN(Date.parse(value));

            if (isValidDate) {
                setEditedEvent((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            } else {
                
                console.warn("Invalid date entered");
            }
        } else {
            setEditedEvent((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSave = async () => {
        if (editedEvent.name.trim() === '') {
            alert('Title cannot be empty');
            return;
        }

        console.log(studyGroupId)
        if (isNew) {
            try {
                const res = await createScheduleEvent({
                    name: editedEvent.name,
                    desc: editedEvent.desc,
                    timestamp: editedEvent.timestamp,
                    studyGroupId: studyGroupId || '',
                    institutionId: institutionId,
                    creatorId: userData?._id || '',
                });
                
                editedEvent._id = res._id;
                editedEvent._id = res._id;
            } catch (error) {
                console.error("Error creating schedule event:", error);
            }
        } else {
            // const eventDate = new Date(editedEvent.timestamp).toISOString().split('T')[0];

            // if (eventDate !== editedEvent.) {
            //
            //     const confirmMessage = `This event will be moved to ${new Date(updatedEvent.timestamp).toLocaleDateString()}. Do you want to continue?`;
            //     if (window.confirm(confirmMessage)) {
            //         setEvents((prevEvents) =>
            //             prevEvents.filter((event) => event._id !== updatedEvent._id)
            //         );
            //     }
            // }
            updateMutation.mutate({
                collection: 'schedule',
                documentId: editedEvent._id,
                newData: editedEvent,
            });
        }

        onSave(index, editedEvent);
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (isNew) {
            onCancel(index);
        } else {
            setIsEditing(false);
        }
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            deleteMutation.mutate({ elementIds: [editedEvent._id], elementType: CollectionTypes.Schedule });
            onDelete(index);
        }
    };

    return (
        <div className="relative p-2 mb-1 rounded-lg shadow-sm text-left border-2 transition-all bg-white border-gray-200 hover:border-blue-300 dark:bg-gray-900 dark:border-gray-800 hover:dark:border-gray-700 w-full flex flex-col gap-2">

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {!studyGroupId ? <FaSchool className="text-orange-400"/> : <FaCalendarAlt className="text-blue-500"/>}
                    {isEditing ? (
                        <input
                            type="text"
                            name="name"
                            value={editedEvent.name}
                            onChange={handleInputChange}
                            className="text-md font-bold w-full text-gray-600 dark:text-white bg-transparent border-b-2 border-gray-300 dark:border-gray-800 focus:outline-none"
                            placeholder={t("title")}
                        />
                    ) : (
                        <h2 className="text-md font-bold text-gray-600 dark:text-white">
                            {eventData.name || 'Event Title'} {!studyGroupId && <span className={'font-normal text-xs text-gray-400'}>(School Event)</span>}
                        </h2>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <span className="flex items-center text-gray-500 text-xs">
                        <FaClock className="mr-1" />
                        {isEditing ? (
                            <input
                                type="date"
                                name="timestamp"
                                value={new Date(editedEvent.timestamp).toISOString().slice(0, 10)}
                                onChange={handleInputChange}
                                className="text-xs text-gray-400 dark:text-gray-700 bg-transparent border-b-2 border-gray-300 focus:outline-none dark:border-gray-800"
                            />
                        ) : (
                            <span>{new Date(eventData.timestamp).toLocaleDateString()}</span>
                        )}
                    </span>

                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={isCreating}
                                className="text-green-500 hover:text-green-700 focus:outline-none"
                            >
                                <FaSave />
                            </button>
                            <button
                                onClick={handleCancel}
                                className="text-red-500 hover:text-red-700 focus:outline-none"
                            >
                                <FaTimes />
                            </button>
                        </>
                    ) : (
                        <>
                            {canEdit && <button
                                onClick={() => setIsEditing(true)}
                                className="text-blue-500 hover:text-blue-700 focus:outline-none"
                            >
                                <FaEdit />
                            </button>}
                            {!isNew && canEdit && (
                                <button
                                    onClick={handleDelete}
                                    className="text-red-500 hover:text-red-700 focus:outline-none"
                                >
                                    <FaTrash />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Descripción del evento en un renglón separado (solo si existe) */}
            {eventData.desc && !isEditing && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{eventData.desc}</p>
            )}

            {isEditing && (
                <textarea
                    name="desc"
                    value={editedEvent.desc || ''}
                    onChange={handleInputChange}
                    className="text-sm text-gray-600 dark:text-white bg-transparent border-b-2 border-gray-300 focus:outline-none w-full  dark:border-gray-800"
                    placeholder={t("addDescriptionPlaceholder")}
                />
            )}

            <div className="flex items-center text-xs text-gray-400 dark:text-gray-700 gap-4">
                <span className="flex items-center">
                    <CreatorLabel creatorId={eventData.creatorId} />
                </span>
            </div>
        </div>
    );
};

export default ScheduleEventDataElement;