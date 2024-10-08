export interface UserData {
    _id: string;
    uid: string;
    name: string;
    email: string;
    country: string;
    createdAt: Date;
    lastLogin: Date;
    followedCourses: string[];
    __v: number;
}