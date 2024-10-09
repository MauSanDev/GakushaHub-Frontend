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
}