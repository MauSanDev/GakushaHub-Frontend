import React, { useState } from 'react';
import NewGenerationPage from "./NewGenerationPage.tsx";
import { useNavigate} from "react-router-dom";


const GenerationButton: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(true);
    const navigate = useNavigate()

    const handleCloseModal = () => {
        navigate("/")
        setIsModalVisible(false);
    };

    return (
        <>
            <NewGenerationPage isVisible={isModalVisible} onClose={handleCloseModal} />
        </>
    );
};

export default GenerationButton;