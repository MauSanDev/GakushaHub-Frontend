
export interface ResourceData {
    _id: string;
    title: string;
    description?: string;
    type: ResourceTypes;
    size?: string;
    url?: string;
    tags?: string[];
    creatorId: string;
    institutionId: string;
    createdAt: string;
}

export enum ResourceTypes {
    Audio = 'audio',
    Video = 'video',
    Image = 'image',
    Document = 'document',
    Compressed = 'rar',
    LinkText = 'link_text',
    File = 'file',
}
