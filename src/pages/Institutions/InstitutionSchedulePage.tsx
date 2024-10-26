import React from 'react';
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import {useParams} from "react-router-dom";
import ScheduleCalendar from "./Components/ScheduleCalendar.tsx";

const InstitutionSchedulePage: React.FC = () => {
    const { institutionId } = useParams<{ institutionId: string }>();

    return (
        <SectionContainer title={"Institution Schedule"}>

            <div className="document-list flex flex-col gap-2 py-1 overflow-y-auto h-full pb-80"
                 style={{maxHeight: 'calc(100vh)'}}>
                <div className="w-full max-w-4xl mx-auto mt-6">
                    <ScheduleCalendar
                        institutionId={institutionId || ''}
                        canEdit={true}
                    />
                </div>
            </div>
        </SectionContainer>
);
};

export default InstitutionSchedulePage;