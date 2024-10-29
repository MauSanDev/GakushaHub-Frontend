import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaCalendarDay, FaCalendarAlt, FaSchool } from 'react-icons/fa';
import { ScheduleEventData } from "../../../data/ScheduleEventData.ts";
import { useSchedule } from "../../../hooks/newHooks/Courses/useSchedule.ts";
import NoDataMessage from "../../../components/NoDataMessage.tsx";
import ScheduleEventsModal from "../ScheduleEventsModal.tsx";
import LocSpan from "../../../components/LocSpan.tsx";

const months = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
];

const weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

interface ScheduleCalendarProps {
    institutionId: string;
    studyGroupId?: string;
    canEdit: boolean;
    startDate?: Date;
    endDate?: Date;
    institutionView: boolean;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
                                                               institutionId,
                                                               studyGroupId,
                                                               canEdit,
                                                               startDate,
                                                               endDate,
                                                               institutionView,
                                                           }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>();
    const [selectedEventDay, setSelectedEventDay] = useState<ScheduleEventData[]>([]);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [timestamp, setTimestamp] = useState<string>(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`);

    const { fetchSchedule: fetchInstitutionSchedule, data: institutionEvents } = useSchedule(institutionId, timestamp, 1, 10, 'null');
    const { fetchSchedule: fetchCourseSchedule, data: courseEvents } = useSchedule(institutionId, timestamp, 1, 10, studyGroupId || '');

    useEffect(() => {
        fetchInstitutionSchedule();
        if (studyGroupId) {
            console.log(studyGroupId)
            fetchCourseSchedule();
        }
    }, [timestamp]);

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const onModalClosed = () => {
        setIsModalOpen(false);
        fetchInstitutionSchedule();
        if (studyGroupId) {
            fetchCourseSchedule();
        }
    };

    const data = [...institutionEvents?.documents || [], ...courseEvents?.documents || []];

    const getFirstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    const prevMonth = () => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        if (!startDate || newDate >= startDate) {
            setCurrentDate(new Date(newDate));
        }
        setTimestamp(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`);
    };

    const nextMonth = () => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        if (!endDate || newDate <= endDate) {
            setCurrentDate(new Date(newDate));
        }
        setTimestamp(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`);
    };

    const handleDayClick = (day: number) => {
        const selectedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = data?.filter(e => new Date(e.timestamp).toISOString().split('T')[0] === selectedDate) || [];

        setSelectedEventDay(dayEvents);
        setSelectedDate(selectedDate);
        setIsModalOpen(true);
    };

    const isEventDay = (day: number): boolean => {
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return data?.some(e => new Date(e.timestamp).toISOString().split('T')[0] === formattedDate) || false;
    };

    const getEventsForDay = (day: number): ScheduleEventData[] => {
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return data?.filter(e => new Date(e.timestamp).toISOString().split('T')[0] === formattedDate) || [];
    };

    const getDayClass = (day: number): string => {
        if (isOutOfRangeDay(day)) return 'text-gray-200 dark:text-gray-700 pointer-events-none';
        if (isToday(day) && isEventDay(day)) return 'bg-green-500 dark:bg-green-800 text-white';
        if (isToday(day)) return 'bg-green-500 dark:bg-green-800 text-white';
        if (isEventDay(day)) return 'bg-blue-500 dark:bg-blue-800 text-white';
        if (isPastDay(day) && isWeekend(day)) return 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-900 dark:bg-opacity-50';
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
        if (currentDay < new Date()) {
            if (!startDate) {
                return true;
            }
            return currentDay >= startDate;
        }
        return false;
    };

    const isWeekend = (day: number): boolean => {
        const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay();
        return currentDay === 0 || currentDay === 6;
    };

    const isOutOfRangeDay = (day: number): boolean => {
        const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        if (!startDate && !endDate) {return false;}
        if (startDate && endDate) {return currentDay < startDate || currentDay > endDate;}
        if (startDate) {return currentDay < startDate;}
        if (endDate) {return currentDay > endDate;}
        return false;
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

    const upcomingEvents = data?.filter(event => new Date(event.timestamp) >= new Date()) || [];
    const todayEvents = data?.filter(event => {
        const eventDate = new Date(event.timestamp);
        const today = new Date();
        return eventDate.toDateString() === today.toDateString();
    }) || [];

    const oldEvents = data?.filter(event => {
        const eventDate = new Date(event.timestamp);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return eventDate < yesterday;
    }) || [];

    return (
        <div className="flex flex-col items-center overflow-y-scroll m-4">

            {startDate && endDate && (
                <div className="mb-4 text-gray-600 dark:text-gray-600 text-sm">
                    <span>From: {startDate.toDateString()} </span>
                    {' | '}
                    <span>To: {endDate.toDateString()}</span>
                </div>
            )}

            <div className="flex justify-center mb-4 gap-2 w-full max-w-3xl text-black dark:text-white text-lg">
                <button
                    onClick={prevMonth}
                    className="px-2 py-1"
                    disabled={startDate ? currentDate <= startDate : false}
                >
                    <FaArrowLeft/>
                </button>

                <h3><LocSpan textKey={`scheduleKeys.months.${months[currentDate.getMonth()]}`} /> {currentDate.getFullYear()}</h3>

                <button
                    onClick={nextMonth}
                    className="px-2 py-1"
                    disabled={endDate ? currentDate >= endDate : false}
                >
                    <FaArrowRight/>
                </button>
            </div>

            <table className="table-fixed border-collapse w-full max-w-3xl">
                <thead>
                <tr>
                    {weekDays.map((day, index) => (
                        <th key={index} className="w-12 h-16 text-center text-gray-700 dark:text-gray-300 text-xs sm:text-sm"><LocSpan textKey={`scheduleKeys.weekdays.${day}`} /></th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {calendar.map((week, weekIndex) => (
                    <tr key={weekIndex}>
                        {week.map((day, dayIndex) => (
                            <td
                                key={dayIndex}
                                className={`w-12 sm:w-16 text-center transition-all align-top h-16 sm:h-24 ${getDayClass(day)}`}
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

                                {/* Conteo de eventos para cada día solo en pantallas pequeñas */}
                                <div className="flex sm:hidden justify-center space-x-1 mt-1">
                                    {getEventsForDay(day).filter(e => !e.studyGroupId).length > 0 && (
                                        <span className="flex items-center text-orange-400 text-xs">
                                            <FaSchool className="mr-1" />{getEventsForDay(day).filter(e => !e.studyGroupId).length}
                                        </span>
                                    )}
                                    {getEventsForDay(day).filter(e => e.studyGroupId).length > 0 && (
                                        <span className="flex items-center text-blue-500 text-xs">
                                            <FaCalendarAlt className="mr-1" />{getEventsForDay(day).filter(e => e.studyGroupId).length}
                                        </span>
                                    )}
                                </div>

                                {/* Lista completa de eventos en pantallas grandes */}
                                <div className="hidden sm:flex flex-col space-y-1 mt-1">
                                    {getEventsForDay(day).map(event => (
                                        <div key={event._id} className="text-xs dark:text-gray-300 px-2 truncate border rounded dark:border-gray-400 flex items-center space-x-2">
                                            {!event.studyGroupId ? <FaSchool className="text-orange-400" /> : <FaCalendarAlt className="text-blue-500" />}
                                            <span>{event.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Eventos del día */}
            <div className="mt-8 w-full max-w-3xl text-black dark:text-white ">
                <h3 className="text-lg font-semibold mb-2"><LocSpan textKey={"scheduleKeys.todayEvents"} /></h3>
                {todayEvents.length > 0 ? (
                    <ul>
                        {todayEvents.map((event, index) => (
                            <li key={index} className="mb-1">
                                <div className="flex items-center space-x-2">
                                    {!event.studyGroupId ? <FaSchool className="text-orange-400" /> : <FaCalendarAlt className="text-blue-500" />}
                                    <span className={'w-full'}>{new Date(event.timestamp).toLocaleDateString()}: {event.name}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <NoDataMessage />
                )}
            </div>

            {/* Próximos eventos */}
            <div className="mt-8 w-full max-w-3xl text-black dark:text-white ">
                <h3 className="text-lg font-semibold mb-2"><LocSpan textKey={"scheduleKeys.upcomingEvents"} /></h3>
                {upcomingEvents.length > 0 ? (
                    <ul>
                        {upcomingEvents.map((event, index) => (
                            <li key={index} className="mb-1">
                                <div className="flex items-center space-x-2">
                                    {!event.studyGroupId ? <FaSchool className="text-orange-400" /> : <FaCalendarAlt className="text-blue-500" />}
                                    <span className={'w-full'}>{new Date(event.timestamp).toLocaleDateString()}: {event.name}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <NoDataMessage />
                )}
            </div>

            {/* Eventos antiguos */}
            <div className="mt-8 w-full max-w-3xl text-black dark:text-white ">
                <h3 className="text-lg font-semibold mb-2"><LocSpan textKey={"scheduleKeys.pastEvents"} /></h3>
                {oldEvents.length > 0 ? (
                    <ul>
                        {oldEvents.map((event, index) => (
                            <li key={index} className="mb-1">
                                <div className="flex items-center space-x-2">
                                    {!event.studyGroupId ? <FaSchool className="text-orange-400" /> : <FaCalendarAlt className="text-blue-500" />}
                                    <span className={'w-full'}>{new Date(event.timestamp).toLocaleDateString()}: {event.name}</span>
                                </div>
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
                    institutionId={institutionId}
                    studyGroupId={studyGroupId}
                    date={selectedDate || new Date().toISOString()}
                    canEdit={canEdit}
                    institutionView={institutionView}
                />
            )}
        </div>
    );
};

export default ScheduleCalendar;