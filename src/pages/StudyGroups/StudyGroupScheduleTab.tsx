import React from 'react';
import { StudyGroupData } from "../../data/Institutions/StudyGroupData.ts";
import ScheduleCalendar from "../Institutions/Components/ScheduleCalendar.tsx";

interface StudyGroupScheduleProps {
    studyGroup: StudyGroupData;
    canEdit: boolean;
}

const StudyGroupSchedule: React.FC<StudyGroupScheduleProps> = ({ studyGroup, canEdit }) => {

    return (
        <div className="flex flex-col items-center overflow-y-scroll h-screen m-4 pb-80">
            <ScheduleCalendar
                institutionId={studyGroup.institutionId}
                studyGroupId={studyGroup._id}
                canEdit={canEdit}
                startDate={studyGroup.fromDate ? new Date(studyGroup.fromDate) : undefined}
                endDate={studyGroup.toDate ? new Date(studyGroup.toDate) : undefined}
                institutionView={false}
            />
        </div>
    );
};

export default StudyGroupSchedule;