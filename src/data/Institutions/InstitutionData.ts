export interface InstitutionData {
    _id: string;
    name: string;
    description: string;
    creatorId: string;
    createdAt: string;
    lastUpdated: string;
    active: boolean;
    links: string[];
    //debug
    members: number;
    groups: number;
    resources: number;
    role: string
}