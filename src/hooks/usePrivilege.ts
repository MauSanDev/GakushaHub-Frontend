import { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { useMyMemberships } from "./institutionHooks/useMyMemberships";
import {MembershipRole} from "../data/Institutions/MembershipData.ts";

export const usePrivilege = (institutionId: string, creatorId: string) => {
    const { userData } = useAuth();
    const [role, setRole] = useState<MembershipRole>(MembershipRole.None);

    const { data: memberships, fetchMemberships } = useMyMemberships(1, 10);

    useEffect(() => {
        fetchMemberships();
    }, [userData, institutionId, creatorId, fetchMemberships]);

    useEffect(() => {
        if (creatorId && creatorId === userData?._id) {
            setRole(MembershipRole.Owner);
            return;
        }
        
        if (memberships?.documents.some(membership => membership.institutionId?._id === institutionId && (membership.userId ?? "") === userData?._id)) {
            const membership = memberships?.documents.find(m => m.institutionId._id === institutionId && (m.userId ?? "") === userData?._id);

            if (membership) {
                switch (membership.role) {
                    case 'owner':
                        setRole(MembershipRole.Owner);
                        break;
                    case 'staff':
                        setRole(MembershipRole.Staff);
                        break;
                    case 'sensei':
                        setRole(MembershipRole.Sensei);
                        break;
                    case 'student':
                        setRole(MembershipRole.Student);
                        break;
                    default:
                        setRole(MembershipRole.None);
                }
            }
        } else {
            setRole(MembershipRole.None);
        }
    }, [memberships, institutionId, creatorId, userData]);

    return {
        role,
    };
};