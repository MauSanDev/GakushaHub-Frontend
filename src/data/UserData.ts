export interface UserData {
    _id: string;
    uid: string;
    name: string;
    nickname: string;
    email: string;
    country: string;
    createdAt: Date;
    lastLogin: Date;
    followedCourses: string[];
    licenses: Licence[];    
    __v: number;
}

export interface Licence {
    type: string;
    assignedAt: Date;
    expirationDate: Date | null;
    isActive: boolean;
    source: string;
    orgId: string | null;
}