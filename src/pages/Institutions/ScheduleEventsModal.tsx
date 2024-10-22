import React, { useState, useEffect } from 'react';
import ModalWrapper from '../ModalWrapper';
import Container from "../../components/ui/containers/Container";
import SectionTitle from "../../components/ui/text/SectionTitle";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import ScheduleEventDataElement from "./Components/ScheduleEventDataElement";
import { FaPlus } from "react-icons/fa";
import { ScheduleEventData } from "../../data/ScheduleEventData.ts";
import NoDataMessage from "../../components/NoDataMessage.tsx";
import { useDeleteElement } from '../../hooks/useDeleteElement';
import {CollectionTypes} from "../../data/CollectionTypes.tsx"; // Importar el hook

interface ScheduleEventsModalProps {
    onClose: () => void;
    selectedEvents: ScheduleEventData[];
    institutionId: string;
    studyGroupId?: string;
    date: string;
    canEdit: boolean;
}

const ScheduleEventsModal: React.FC<ScheduleEventsModalProps> = ({
                                                                     onClose,
                                                                     selectedEvents,
                                                                     studyGroupId,
                                                                     institutionId,
                                                                     date,
                                                                     canEdit,
                                                                 }) => {
    const [events, setEvents] = useState<ScheduleEventData[]>(selectedEvents);

    const deleteElementMutation = useDeleteElement(); // Inicializar el hook

    useEffect(() => {
        setEvents(selectedEvents);
    }, [selectedEvents]);

    const handleAddEvent = () => {
        const newEvent: ScheduleEventData = {
            _id: (events.length + 1).toString(),
            name: '',
            desc: '',
            timestamp: new Date(date).toISOString(),
            creatorId: 'user1',
            institutionId: institutionId,
            studyGroupId: studyGroupId || 'group1',
        };
        setEvents([...events, newEvent]);
    };

    const handleSaveEvent = (updatedEvent: ScheduleEventData) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event._id === updatedEvent._id ? updatedEvent : event
            )
        );
    };

    const handleCancelEvent = (eventId: string) => {
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
    };

    const handleDeleteEvent = (eventId: string) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            deleteElementMutation.mutate({
                elementIds: [eventId],
                elementType: CollectionTypes.Schedule,
            }, {
                onSuccess: () => {
                    // Eliminar del estado local
                    setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
                },
                onError: (error) => {
                    console.error('Error deleting event:', error);
                }
            });
        }
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
    };

    return (
        <ModalWrapper onClose={onClose}>
            <Container className={"w-full"}>
                <div className="flex justify-between items-center">
                    <SectionTitle title={"Scheduled Events"} className="text-left pt-6" />

                    {canEdit && (
                        <PrimaryButton
                            iconComponent={<FaPlus />}
                            label="Add Event"
                            onClick={handleAddEvent}
                            className="mt-4 text-nowrap"
                        />
                    )}
                </div>

                {events.length > 0 ? (
                    <ul>
                        {events.map((event) => (
                            <li key={event._id}>
                                <ScheduleEventDataElement
                                    eventData={event}
                                    onSave={handleSaveEvent}
                                    onCancel={handleCancelEvent}
                                    onDelete={handleDeleteEvent}
                                    isNew={event.name === ''}
                                    institutionId={institutionId}
                                    studyGroupId={studyGroupId}
                                    canEdit={canEdit}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className={'py-8'}>
                        <NoDataMessage />
                    </div>
                )}
            </Container>
        </ModalWrapper>
    );
};

export default ScheduleEventsModal;