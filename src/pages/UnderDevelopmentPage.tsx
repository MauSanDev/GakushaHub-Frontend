import React from 'react';
import PrimaryButton from "../components/ui/buttons/PrimaryButton.tsx";
import {useNavigate} from "react-router-dom";

const UnderDevelopmentPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="text-center text-3xl text-gray-400 gap-4 flex flex-col items-center justify-center">
            <span>何もないここ :)</span>
            <PrimaryButton label={"backToApp"} onClick={() => { navigate('/'); }} />
        </div>
    );
};

export default UnderDevelopmentPage;