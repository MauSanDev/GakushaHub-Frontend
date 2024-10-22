export interface StudyGroupData {
    _id: string;
    institutionId: string;
    creatorId: string;
    name: string;
    description: string;
    memberIds: string[];
    courseIds: string[];
    createdAt: string;
    resourcesIds: string[];
    isActive: boolean;
    fromDate?: string;
    toDate?: string;
    viewsEnabled: ('schedule' | 'courses' | 'resources' | 'chat' | 'homework' | 'members' | 'settings')[];  // Array que sigue el enum
}