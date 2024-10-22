
export interface ScheduleEventData {
    _id: string;
    name: string;
    desc?: string;
    timestamp: string;
    creatorId: string;
    institutionId: string;
    studyGroupId?: string;
}