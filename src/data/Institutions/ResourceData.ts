
export interface ResourceData {
    _id: string;
    title: string;
    description?: string;
    type: string;
    size?: string;
    url?: string;
    tags?: string[];
    creatorId: string;
    institutionId: string;
    createdAt: string;
}