import React, { useState } from 'react';
import ModalWrapper from '../ModalWrapper';
import Container from "../../components/ui/containers/Container";
import SectionTitle from "../../components/ui/text/SectionTitle";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import ScheduleEventDataElement from "./Components/ScheduleEventDataElement";
import {FaPlus} from "react-icons/fa";
import {ScheduleEventData} from "../../data/ScheduleEventData.ts";

interface ScheduleEventsModalProps {
    onClose: () => void;
}

const ScheduleEventsModal: React.FC<ScheduleEventsModalProps> = ({ onClose }) => {
    const [events, setEvents] = useState<ScheduleEventData[]>([
        {
            _id: '1',
            name: 'Event 1',
            desc: 'Description for event 1',
            timestamp: '2024-10-22T14:00:00',
            creatorId: 'user1',
            institutionId: 'inst1',
            studyGroupId: 'group1',
        },
        {
            _id: '2',
            name: 'Event 2',
            desc: 'Description for event 2',
            timestamp: '2024-10-23T16:00:00',
            creatorId: 'user2',
            institutionId: 'inst2',
            studyGroupId: 'group2',
        },
    ]);

    // Añadir un nuevo evento y abrir en modo edición
    const handleAddEvent = () => {
        const newEvent: ScheduleEventData = {
            _id: (events.length + 1).toString(),
            name: '', // Forzar vacío
            desc: '', // Forzar vacío
            timestamp: new Date().toISOString(),
            creatorId: 'user1', // Ejemplo de ID de usuario
            institutionId: 'inst1',
            studyGroupId: 'group1',
        };
        setEvents([...events, newEvent]); // Agregar el nuevo evento a la lista
    };

    // Guardar cambios del evento
    const handleSaveEvent = (updatedEvent: ScheduleEventData) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event._id === updatedEvent._id ? updatedEvent : event
            )
        );
    };

    // Eliminar evento
    const handleCancelEvent = (eventId: string) => {
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
    };

    // Eliminar evento de la base de datos
    const handleDeleteEvent = (eventId: string) => {
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
    };

    return (
        <ModalWrapper onClose={onClose}>
            <Container className={"w-full"}>
                <div className="flex justify-between items-center">
                    <SectionTitle title={"Scheduled Events"} className="text-left pt-6" />

                    <PrimaryButton
                        iconComponent={<FaPlus />}
                        label="Add Event"
                        onClick={handleAddEvent}
                        className="mt-4 text-nowrap"
                    />
                </div>

                <ul>
                    {events.map((event) => (
                        <li key={event._id}>
                            <ScheduleEventDataElement
                                eventData={event}
                                onSave={handleSaveEvent}
                                onCancel={handleCancelEvent}
                                onDelete={handleDeleteEvent}
                                isNew={event.name === ''} // Solo abrir en modo edición si el nombre está vacío
                            />
                        </li>
                    ))}
                </ul>
            </Container>
        </ModalWrapper>
    );
};

export default ScheduleEventsModal;