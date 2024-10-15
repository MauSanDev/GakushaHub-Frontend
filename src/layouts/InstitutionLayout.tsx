import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InstitutionSidebar from "../pages/Institutions/InstitutionSidebar.tsx";
import { MembershipRole } from '../data/MembershipData.ts';
import { useInstitutionById } from "../hooks/institutionHooks/useInstitutionById.ts";

const InstitutionRoute: React.FC = () => {
    const { isAuthenticated, getRole } = useAuth();
    const { institutionId } = useParams<{ institutionId: string }>();
    const [role, setRole] = useState<MembershipRole>(MembershipRole.None);
    const [loadingRole, setLoadingRole] = useState(true);
    const [loadingInstitution, setLoadingInstitution] = useState(true);
    const navigate = useNavigate();

    const { data: institution, isLoading: institutionLoading, fetchInstitution } = useInstitutionById(institutionId || "");

    // Fetch institution data when institutionId changes
    useEffect(() => {
        if (institutionId) {
            setLoadingInstitution(true);
            fetchInstitution();
            setLoadingInstitution(false);
        }
    }, [institutionId, fetchInstitution]);

    // Fetch role after institution is fetched
    useEffect(() => {
        const fetchRole = async () => {
            if (institutionId && institution?.creatorId) {
                try {
                    const fetchedRole = await getRole(institutionId, institution.creatorId);
                    setRole(fetchedRole);
                } catch (error) {
                    console.error('Error fetching role:', error);
                } finally {
                    setLoadingRole(false);
                }
            } else {
                setLoadingRole(false);
            }
        };

        if (!institutionLoading && institution) {
            fetchRole();
        }
    }, [institutionId, institution, getRole, institutionLoading]);

    // Redirect if not authenticated or doesn't have the right role
    useEffect(() => {
        if (!loadingRole && !loadingInstitution && (!isAuthenticated || (role !== MembershipRole.Owner && role !== MembershipRole.Staff && role !== MembershipRole.Sensei))) {
            navigate(-1);
        }
    }, [role, isAuthenticated, loadingRole, loadingInstitution, navigate]);

    // Show loading state while fetching institution and role
    if (loadingInstitution || loadingRole || institutionLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex h-screen w-full px-2 overflow-visible">
            <InstitutionSidebar />
            <div className="flex-1 flex flex-col items-center justify-center">
                <Outlet />
            </div>
        </div>
    );
};

export default InstitutionRoute;