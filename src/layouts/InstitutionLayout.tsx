import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InstitutionSidebar from "../pages/Institutions/InstitutionSidebar.tsx";
import { MembershipRole } from '../data/Institutions/MembershipData.ts';
import { useInstitutionById } from "../hooks/institutionHooks/useInstitutionById.ts";

const InstitutionRoute: React.FC = () => {
    const { isAuthenticated, getRole } = useAuth(); // Usamos getRole desde useAuth
    const { institutionId } = useParams<{ institutionId: string }>();
    const { data, isLoading: institutionLoading } = useInstitutionById(institutionId || "");
    const [role, setRole] = useState<MembershipRole>(MembershipRole.None); // Guardamos el rol en un estado local
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';

        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, []);

    useEffect(() => {
        const fetchRole = async () => {
            if (institutionId && data?.creatorId) {
                const fetchedRole = await getRole(institutionId, data.creatorId);
                setRole(fetchedRole);
                setLoading(false);
            }
        };

        if (!institutionLoading) {
            fetchRole();
        }
    }, [institutionId, data, getRole, institutionLoading]);

    useEffect(() => {
        if (!loading && (!isAuthenticated || (role !== MembershipRole.Owner && role !== MembershipRole.Staff && role !== MembershipRole.Sensei))) {
            navigate(-1);
        }
    }, [role, isAuthenticated, loading, navigate]);

    if (loading || institutionLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex h-screen w-full px-2 overflow-visible">
            <InstitutionSidebar />
            <div className="flex-1 flex flex-col items-center justify-center">
                <span className={"text-white"}>{role}</span>
                <Outlet />
            </div>
        </div>
    );
};

export default InstitutionRoute;