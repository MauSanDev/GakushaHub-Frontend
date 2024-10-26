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
import {useUpdateData} from "../../hooks/updateHooks/useUpdateData.ts";
import {CollectionTypes} from "../../data/CollectionTypes.tsx";

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
                                                                     canEdit
                                                                 }) => {
    const [events, setEvents] = useState<ScheduleEventData[]>(selectedEvents);

    const updateMutation = useUpdateData<ScheduleEventData>(); 
    const deleteMutation = useDeleteElement(); 

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
            institutionId,
            studyGroupId: studyGroupId,
        };
        setEvents([...events, newEvent]);
    };

    const handleSaveEvent = (updatedEvent: ScheduleEventData) => {
        const eventDate = new Date(updatedEvent.timestamp).toISOString().split('T')[0]; 

        if (eventDate !== date) {
            
            const confirmMessage = `This event will be moved to ${new Date(updatedEvent.timestamp).toLocaleDateString()}. Do you want to continue?`;
            if (window.confirm(confirmMessage)) {
                updateMutation.mutate({
                    collection: 'schedule',
                    documentId: updatedEvent._id,
                    newData: updatedEvent,
                });
                setEvents((prevEvents) =>
                    prevEvents.filter((event) => event._id !== updatedEvent._id)
                );
            }
        } else {
            
            updateMutation.mutate({
                collection: 'schedule',
                documentId: updatedEvent._id,
                newData: updatedEvent,
            });
            setEvents((prevEvents) =>
                prevEvents.map((event) => (event._id === updatedEvent._id ? updatedEvent : event))
            );
        }
    };

    const handleCancelEvent = (eventId: string) => {
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
    };

    const handleDeleteEvent = (eventId: string) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            deleteMutation.mutate({ elementIds: [eventId], elementType: CollectionTypes.Schedule });
            setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
        }
    };

    return (
        <ModalWrapper onClose={onClose}>
            <Container className={"w-full"}>
                <div className="flex justify-between items-center">
                    <SectionTitle title={"scheduleKeys.scheduledEvents"} className="text-left pt-6" />

                    {canEdit && (
                        <PrimaryButton
                            iconComponent={<FaPlus />}
                            label="scheduleKeys.addEvent"
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
                                    institutionId={event.institutionId}
                                    studyGroupId={event.studyGroupId}
                                    canEdit={!!canEdit && !!event.studyGroupId}
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