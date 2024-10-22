import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaCalendarDay } from 'react-icons/fa';
import NoDataMessage from "../../components/NoDataMessage.tsx";
import ScheduleEventsModal from "../Institutions/ScheduleEventsModal.tsx";
import { useSchedule } from "../../hooks/newHooks/Courses/useSchedule.ts";
import { ScheduleEventData } from "../../data/ScheduleEventData.ts";
import { StudyGroupData } from "../../data/Institutions/StudyGroupData.ts";
import { MembershipRole } from "../../data/MembershipData.ts";

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

interface StudyGroupScheduleProps {
    studyGroup: StudyGroupData;
    canEdit: boolean;
    role: MembershipRole;
}

const StudyGroupSchedule: React.FC<StudyGroupScheduleProps> = ({ studyGroup, canEdit, role }) => {
    const startDate = new Date('2024-09-01');
    const endDate = new Date('2024-12-15');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>();
    const [selectedEventDay, setSelectedEventDay] = useState<ScheduleEventData[]>([]);

    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [timestamp, setTimestamp] = useState<string>(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`);

    const { fetchSchedule, data } = useSchedule(studyGroup._id, studyGroup.institutionId, timestamp, 1, 10);

    useEffect(() => {
        fetchSchedule();
    }, [timestamp]);

    useEffect(() => {
        const today = new Date();
        if (today > endDate) {
            setCurrentDate(new Date(endDate));
        } else if (today < startDate) {
            setCurrentDate(new Date(startDate));
        } else {
            setCurrentDate(new Date(today));
        }
    }, []);

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const onModalClosed = () => {
        setIsModalOpen(false);
        fetchSchedule();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    const prevMonth = () => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        if (newDate >= startDate) {
            setCurrentDate(new Date(newDate));
        } else {
            setCurrentDate(new Date(startDate));
        }
        setTimestamp(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`);
    };

    const nextMonth = () => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        if (newDate <= endDate) {
            setCurrentDate(new Date(newDate));
        } else {
            setCurrentDate(new Date(endDate));
        }
        setTimestamp(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`);
    };

    const handleDayClick = (day: number) => {
        const selectedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = data?.documents.filter(e => new Date(e.timestamp).toISOString().split('T')[0] === selectedDate) || [];

        setSelectedEventDay(dayEvents);
        setSelectedDate(selectedDate)
        setIsModalOpen(true);
    };

    const isEventDay = (day: number): boolean => {
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return data?.documents.some(e => new Date(e.timestamp).toISOString().split('T')[0] === formattedDate) || false;
    };

    const getEventsForDay = (day: number): ScheduleEventData[] => {
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return data?.documents.filter(e => new Date(e.timestamp).toISOString().split('T')[0] === formattedDate) || [];
    };

    const getDayClass = (day: number): string => {
        if (isOutOfRangeDay(day)) return 'text-gray-200 dark:text-gray-700 pointer-events-none';
        if (isToday(day) && isEventDay(day)) return 'bg-green-500 dark:bg-green-800 text-black dark:text-white';
        if (isToday(day)) return 'bg-green-500 dark:bg-green-800 text-black dark:text-white';
        if (isEventDay(day)) return 'bg-blue-500 dark:bg-blue-800 text-white';
        if (isPastDay(day) && isWeekend((day))) return 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50';
        if (isPastDay(day)) return 'text-gray-400 dark:text-gray-600';
        if (isWeekend(day)) return 'bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50 text-black dark:text-white';
        return 'hover:bg-blue-200 dark:hover:bg-gray-800 text-black dark:text-white';
    };

    const isToday = (day: number): boolean => {
        const today = new Date();
        const formattedCurrentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return formattedCurrentDate.toDateString() === today.toDateString();
    };

    const isPastDay = (day: number): boolean => {
        const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return currentDay < new Date() && currentDay >= startDate;
    };

    const isWeekend = (day: number): boolean => {
        const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay();
        return currentDay === 0 || currentDay === 6;
    };

    const isOutOfRangeDay = (day: number): boolean => {
        const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return currentDay < startDate || currentDay > endDate;
    };

    const daysInMonth = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    const firstDay = getFirstDayOfMonth(currentDate.getMonth(), currentDate.getFullYear());

    const generateCalendar = () => {
        const calendar: number[][] = [];
        let week: number[] = [];
        for (let i = 0; i < firstDay; i++) {
            week.push(0);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            week.push(day);
            if (week.length === 7) {
                calendar.push(week);
                week = [];
            }
        }
        if (week.length > 0) {
            while (week.length < 7) {
                week.push(0);
            }
            calendar.push(week);
        }
        return calendar;
    };

    const calendar = generateCalendar();

    const upcomingEvents = data?.documents.filter(event => new Date(event.timestamp) >= new Date()) || [];
    const oldEvents = data?.documents.filter(event => new Date(event.timestamp) < new Date()) || [];

    return (
        <div className="flex flex-col items-center overflow-y-scroll h-2/3 m-4">
            <div className="mb-4 text-gray-600 dark:text-gray-600 text-sm ">
                <span>From: {startDate.toDateString()}</span>
                {' | '}
                <span>Until: {endDate.toDateString()}</span>
            </div>

            <div className="flex justify-center mb-4 gap-2 w-full max-w-3xl text-black dark:text-white text-lg">
                <button onClick={prevMonth} className="px-4 py-2" disabled={currentDate <= startDate}>
                    <FaArrowLeft />
                </button>

                <h3>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>

                <button onClick={nextMonth} className="px-4 py-2" disabled={currentDate >= endDate}>
                    <FaArrowRight />
                </button>
            </div>

            {/* Calendario */}
            <table className="table-fixed border-collapse w-full max-w-3xl">
                <thead>
                <tr>
                    {weekDays.map((day, index) => (
                        <th key={index} className="w-16 h-24 text-center text-gray-700 dark:text-gray-300">{day}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {calendar.map((week, weekIndex) => (
                    <tr key={weekIndex}>
                        {week.map((day, dayIndex) => (
                            <td
                                key={dayIndex}
                                className={`w-16 text-center transition-all align-top h-24 ${getDayClass(day)}`}
                                onClick={() => !isOutOfRangeDay(day) && handleDayClick(day)}
                            >
                                <div className={`rounded-full w-full flex items-center justify-center ${isToday(day) ? 'relative' : ''}`}>
                                    {day !== 0 ? (
                                        <>
                                            {day}
                                            {isToday(day) && (
                                                <FaCalendarDay className="absolute bottom-1 right-1 text-white-300 text-xs" />
                                            )}
                                        </>
                                    ) : ''}
                                </div>
                                {/* Mostrar los eventos del día */}
                                {getEventsForDay(day).map(event => (
                                    <div key={event._id} className="text-xs text-gray-500 dark:text-gray-300 truncate mt-1">
                                        {event.name}
                                    </div>
                                ))}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="mt-8 w-full max-w-3xl text-black dark:text-white ">
                <h3 className="text-lg font-semibold mb-2">Upcoming Events:</h3>
                {upcomingEvents.length > 0 ? (
                    <ul>
                        {upcomingEvents.map((event, index) => (
                            <li key={index} className="mb-1">
                                {new Date(event.timestamp).toLocaleDateString()}: {event.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No upcoming events</p>
                )}
            </div>

            {/* Lista de eventos antiguos */}
            <div className="mt-8 w-full max-w-3xl text-black dark:text-white ">
                <h3 className="text-lg font-semibold mb-2">Past Events:</h3>
                {oldEvents.length > 0 ? (
                    <ul>
                        {oldEvents.map((event, index) => (
                            <li key={index} className="mb-1">
                                {new Date(event.timestamp).toLocaleDateString()}: {event.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <NoDataMessage />
                )}
            </div>

            {isModalOpen && (
                <ScheduleEventsModal
                    onClose={onModalClosed}
                    selectedEvents={selectedEventDay}
                    institutionId={studyGroup.institutionId}
                    studyGroupId={studyGroup._id}
                    date={selectedDate || new Date().toISOString()}
                    canEdit={canEdit}
                />
            )}
        </div>
    );
};

export default StudyGroupSchedule;