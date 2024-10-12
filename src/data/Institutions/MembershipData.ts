export interface MembershipData {
    _id: string;
    userId?: {
        _id: string;
        name: string;
    }; 
    email: string; 
    institutionId: string; 
    role: MembershipRole; 
    status: MembershipStatus; 
    joinedAt: string; 
    isActive: boolean; 
}
export enum MembershipRole {
    Owner = 'owner',
    Sensei = 'sensei',
    Student = 'student',
    Staff = 'staff',
    None = 'none'
}

export enum MembershipStatus {
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected'
}