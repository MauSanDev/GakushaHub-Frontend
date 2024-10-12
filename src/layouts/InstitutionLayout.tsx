import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InstitutionSidebar from "../pages/Institutions/InstitutionSidebar.tsx";
import { usePrivilege } from '../hooks/usePrivilege';
import { MembershipRole } from '../data/Institutions/MembershipData.ts';
import { useInstitutionById } from "../hooks/institutionHooks/useInstitutionById.ts";

const InstitutionRoute: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { institutionId } = useParams<{ institutionId: string }>();
    const { data, isLoading: institutionLoading } = useInstitutionById(institutionId || "");  // Incluimos isLoading
    const { role } = usePrivilege(institutionId || '', data?.creatorId || '');
    const [loading, setLoading] = useState(true);  // Estado para manejar la carga del rol y la institución
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
        // Esperamos a que ambos: institutionId y role, estén completamente cargados
        if (!institutionLoading && role !== MembershipRole.None) {
            setLoading(false);
        }
    }, [institutionLoading, role]);

    useEffect(() => {
        // Si el rol no es adecuado, redirigimos cuando ya tenemos los datos cargados
        if (!loading && (!isAuthenticated || (role !== MembershipRole.Owner && role !== MembershipRole.Staff && role !== MembershipRole.Sensei))) {
            navigate("/");
        }
    }, [role, isAuthenticated, loading, navigate]);

    // Mostrar algo mientras la institución y el rol están cargando
    if (loading || institutionLoading) {
        return <div>Loading...</div>;  // Pantalla de carga personalizada
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