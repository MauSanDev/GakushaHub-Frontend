
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
    Link = 'link',
    YouTube = 'youtube',
    Image = 'image',
    Document = 'document',
    Compressed = 'rar',
    NoteText = 'note_text',
    File = 'file',
}
