import React, { useState, useEffect } from 'react';
import ModalWrapper from '../ModalWrapper';
import Container from "../../components/ui/containers/Container";
import SectionTitle from "../../components/ui/text/SectionTitle";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import ScheduleEventDataElement from "./Components/ScheduleEventDataElement";
import { FaPlus } from "react-icons/fa";
import { ScheduleEventData } from "../../data/ScheduleEventData.ts";
import NoDataMessage from "../../components/NoDataMessage.tsx";
import {useAuth} from "../../context/AuthContext.tsx";

interface ScheduleEventsModalProps {
    onClose: () => void;
    selectedEvents: ScheduleEventData[];
    institutionId: string;
    studyGroupId?: string;
    date: string;
    canEdit: boolean;
    instituionView: boolean;
}

const ScheduleEventsModal: React.FC<ScheduleEventsModalProps> = ({
                                                                     onClose,
                                                                     selectedEvents,
                                                                     studyGroupId,
                                                                     institutionId,
                                                                     date,
                                                                     canEdit,
                                                                     instituionView,
                                                                 }) => {
    const [events, setEvents] = useState<ScheduleEventData[]>(selectedEvents);
    const { userData } = useAuth();

    useEffect(() => {
        console.log(studyGroupId)
        setEvents(selectedEvents);
    }, [selectedEvents]);

    const handleAddEvent = () => {
        const newEvent: ScheduleEventData = {
            _id: (events.length + 1).toString(),
            name: '',
            desc: '',
            timestamp: new Date(date).toISOString(),
            creatorId: userData?._id || '',
            institutionId,
            studyGroupId: studyGroupId,
        };
        setEvents([...events, newEvent]);
    };

    const handleSaveEvent = (index: number, updatedEvent: ScheduleEventData) => {
        setEvents((prevEvents) =>
            prevEvents.map((event, elemIndex) => (index === elemIndex ? updatedEvent : event))
        );
    };

    const handleCancelEvent = (index: number) => {
        setEvents((prevEvents) => prevEvents.filter((_, eventIndex) => index !== eventIndex));
    };

    const handleDeleteEvent = (index: number) => {
        setEvents((prevEvents) => prevEvents.filter((_, elemIndex) => elemIndex !== index));
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
                        {events.map((event, index) => (
                            <li key={event._id}>
                                <ScheduleEventDataElement
                                    index={index}
                                    eventData={event}
                                    onSave={handleSaveEvent}
                                    onCancel={handleCancelEvent}
                                    onDelete={handleDeleteEvent}
                                    isNew={event.name === ''}
                                    institutionId={event.institutionId}
                                    studyGroupId={event.studyGroupId}
                                    canEdit={!!canEdit && (!!event.studyGroupId || instituionView)}
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