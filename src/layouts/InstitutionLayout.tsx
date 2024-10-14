import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InstitutionSidebar from "../pages/Institutions/InstitutionSidebar.tsx";
import { MembershipRole } from '../data/MembershipData.ts';
import { useInstitutionById } from "../hooks/institutionHooks/useInstitutionById.ts";

const InstitutionRoute: React.FC = () => {
    const { isAuthenticated, getRole } = useAuth();
    const { institutionId } = useParams<{ institutionId: string }>();
    const { data, isLoading: institutionLoading } = useInstitutionById(institutionId || "");
    const [role, setRole] = useState<MembershipRole>(MembershipRole.None);
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

    // Carga del rol del usuario
    useEffect(() => {
        const fetchRole = async () => {
            if (institutionId && data?.creatorId) {
                try {
                    const fetchedRole = await getRole(institutionId, data.creatorId);
                    setRole(fetchedRole);
                } catch (error) {
                    console.error('Error fetching role:', error);
                } finally {
                    setLoading(false); // Asegurarse de que el loading se actualice
                }
            } else {
                setLoading(false); // Si no hay institutionId o creatorId, dejamos de cargar
            }
        };

        if (!institutionLoading) {
            fetchRole();
        }
    }, [institutionId, data, getRole, institutionLoading]);

    // Redirección si no está autenticado o no tiene el rol adecuado
    useEffect(() => {
        if (!loading && (!isAuthenticated || (role !== MembershipRole.Owner && role !== MembershipRole.Staff && role !== MembershipRole.Sensei))) {
            navigate(-1);
        }
    }, [role, isAuthenticated, loading, navigate]);

    // Si está cargando, mostrar mensaje de "Loading"
    if (loading || institutionLoading) {
        return <div>Loading...</div>;
    }

    // Si todo está bien, renderizar el componente
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