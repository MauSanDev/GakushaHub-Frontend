import React, { useState } from 'react';
import { FaClock, FaUser, FaCalendarAlt, FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import { ScheduleEventData } from "../../../data/ScheduleEventData.ts";
import { useSchedule } from "../../../hooks/newHooks/Courses/useSchedule.ts";
import { useAuth } from "../../../context/AuthContext.tsx";

interface ScheduleEventDataElementProps {
    eventData: ScheduleEventData;
    onSave: (updatedEvent: ScheduleEventData) => void;
    onCancel: (eventId: string) => void;
    onDelete: (eventId: string) => void;
    isNew?: boolean;
    institutionId: string;
    studyGroupId?: string;
    canEdit: boolean;
}

const ScheduleEventDataElement: React.FC<ScheduleEventDataElementProps> = ({
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

    const { createScheduleEvent, isCreating } = useSchedule(eventData.studyGroupId, eventData.institutionId, eventData.timestamp, 1, 10);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'timestamp') {
            // Solo actualizamos si la fecha es válida
            const isValidDate = !isNaN(Date.parse(value));  // Verifica si el valor es una fecha válida

            if (isValidDate) {
                setEditedEvent((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            } else {
                // Opcional: Podrías mostrar un mensaje de error o solo ignorar la entrada inválida
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

        if (isNew) {
            try {
                // Crea un nuevo evento y luego actualiza la lista de eventos
                await createScheduleEvent({
                    name: editedEvent.name,
                    desc: editedEvent.desc,
                    timestamp: editedEvent.timestamp,
                    studyGroupId: studyGroupId || '',
                    institutionId: institutionId,
                    creatorId: userData?._id || '',
                });
                onSave(editedEvent); // Asegúrate de pasar el evento actualizado al padre
                setIsEditing(false);
            } catch (error) {
                console.error("Error creating schedule event:", error);
            }
        } else {
            onSave(editedEvent); // Guarda el evento editado
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        if (isNew) {
            onCancel(eventData._id);
        } else {
            setIsEditing(false);
        }
    };

    const handleDelete = () => {
        onDelete(eventData._id);
    };

    return (
        <div className="relative p-2 mb-1 rounded-lg shadow-sm text-left border-2 transition-all bg-white border-gray-200 hover:border-blue-300 dark:bg-gray-900 dark:border-gray-800 hover:dark:border-gray-700 w-full flex flex-col gap-2">

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" />
                    {isEditing ? (
                        <input
                            type="text"
                            name="name"
                            value={editedEvent.name}
                            onChange={handleInputChange}
                            className="text-md font-bold w-full text-gray-600 dark:text-white bg-transparent border-b-2 border-gray-300 dark:border-gray-800 focus:outline-none"
                            placeholder="Event Title"
                        />
                    ) : (
                        <h2 className="text-md font-bold text-gray-600 dark:text-white">
                            {eventData.name || 'Event Title'}
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
                            {!isNew && (
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
                    placeholder="Event description (optional)"
                />
            )}

            <div className="flex items-center text-xs text-gray-400 dark:text-gray-700 gap-4">
                <span className="flex items-center">
                    <FaUser className="mr-1" />
                    <span>{eventData.creatorId || 'Unknown Creator'}</span>
                </span>
            </div>
        </div>
    );
};

export default ScheduleEventDataElement;