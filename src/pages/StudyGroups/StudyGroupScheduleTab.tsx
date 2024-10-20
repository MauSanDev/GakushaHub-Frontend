import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaCalendarDay } from 'react-icons/fa';

interface Event {
    date: string;
    event: string;
}

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

const StudyGroupSchedule: React.FC = () => {
    const startDate = new Date('2024-09-01');
    const endDate = new Date('2024-12-15');

    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [events, setEvents] = useState<Event[]>([
        { date: '2024-10-20', event: 'Study group meeting' },
        { date: '2024-10-25', event: 'Final exam' },
    ]);

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
    };

    const nextMonth = () => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        if (newDate <= endDate) {
            setCurrentDate(new Date(newDate));
        } else {
            setCurrentDate(new Date(endDate));
        }
    };

    const handleDayClick = (day: number) => {
        const selectedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const event = events.find(e => e.date === selectedDate);

        if (event) {
            alert(`Event: ${event.event}`);
        } else {
            const newEvent = prompt(`Add event for ${selectedDate}:`);
            if (newEvent) {
                setEvents([...events, { date: selectedDate, event: newEvent }]);
            }
        }
    };

    const isEventDay = (day: number): boolean => {
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.some(e => e.date === formattedDate);
    };

    const getEventForDay = (day: number) => {
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(e => e.date === formattedDate);
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

    const oldEvents = events.filter(event => new Date(event.date) < new Date());
    const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());

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

    return (
        <div className="flex flex-col items-center overflow-y-scroll h-2/3 m-4">
            <div className="mb-4 text-gray-600 dark:text-gray-600 text-sm ">
                <span>From: {startDate.toDateString()}</span>
                {' | '}
                <span>Until: {endDate.toDateString()}</span>
            </div>

            <div className="flex justify-center mb-4 gap-2 w-full max-w-3xl text-black dark:text-white text-lg">
                <button onClick={prevMonth} className="px-4 py-2"
                        disabled={currentDate <= startDate}>
                    <FaArrowLeft />
                </button>

                <h3>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>

                <button onClick={nextMonth} className="px-4 py-2"
                        disabled={currentDate >= endDate}>
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
                                {day !== 0 && isEventDay(day) && (
                                    <div className="flex flex-col gap-1 mt-1">
                                        {getEventForDay(day).map((event, index) => (
                                            <div key={index} className="border border-gray-300 dark:border-gray-600 rounded p-1 text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                                {event.event}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Lista de eventos futuros */}
            <div className="mt-8 w-full max-w-3xl text-black dark:text-white ">
                <h3 className="text-lg font-semibold mb-2">Upcoming Events:</h3>
                {upcomingEvents.length > 0 ? (
                    <ul>
                        {upcomingEvents.map((event, index) => (
                            <li key={index} className="mb-1">
                                {event.date}: {event.event}
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
                                {event.date}: {event.event}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No old events</p>
                )}
            </div>
        </div>
    );
};

export default StudyGroupSchedule;