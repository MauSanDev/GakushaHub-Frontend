import { FaRedo, FaTimes } from "react-icons/fa";
import ModalWrapper from "../../pages/ModalWrapper"
import Container from "../ui/containers/Container.tsx";
import PrimaryButton from "../ui/buttons/PrimaryButton.tsx";

interface SummaryModalProps {
    correctCount: number;
    incorrectCount: number;
    totalCards: number;
    onRetryIncorrect: () => void;
    onRetryAll: () => void;
    onClose: () => void;
}

const SummaryModal: React.FC<SummaryModalProps> = ({
                                                       correctCount,
                                                       incorrectCount,
                                                       totalCards,
                                                       onRetryIncorrect,
                                                       onRetryAll,
                                                       onClose,
                                                   }) => {
    const completionPercentage = Math.round((correctCount / totalCards) * 100);

    return (
        <ModalWrapper onClose={onClose} className={"z-50"}>
            <Container className={"text-white w-full"}>
                <h2 className="text-3xl font-bold mb-4 text-center">Deck Completed!</h2>
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <svg className="w-28 h-28">
                            <circle
                                className="text-gray-900 dark:text-gray-700"
                                strokeWidth="5"
                                stroke="currentColor"
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                            />
                            <circle
                                className="text-green-500"
                                strokeWidth="5"
                                strokeDasharray="251.2"
                                strokeDashoffset={251.2 - (completionPercentage / 100) * 251.2}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                            />
                        </svg>
                        <span className="absolute inset-0 flex -mt-3 -ml-2 items-center justify-center text-xl font-bold">
                            {completionPercentage}%
                        </span>
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <span className="text-lg text-center mb-4">
                        Correct: <span className="text-green-400 font-bold">{correctCount}</span> / {totalCards}
                    </span>

                    {incorrectCount > 0 &&
                        <span className="text-lg text-center mb-6">
                            Incorrect: <span className="text-red-400 font-bold">{incorrectCount}</span> / {totalCards}
                        </span>
                    }
                </div>
                
                <div className="flex justify-center gap-3">
                    {incorrectCount > 0 && (
                        <PrimaryButton iconComponent={<FaRedo/>} label={"Retry Incorrect"} onClick={onRetryIncorrect} className={"bg-gray-700 hover:bg-gray-600 dark:bg-gray-700 hover:dark:bg-gray-600"}/>
                    )}

                    <PrimaryButton iconComponent={<FaRedo/>} label={"Retry All"} onClick={onRetryAll}/>
                    <PrimaryButton iconComponent={<FaTimes/>} label={"Close"} onClick={onClose} className={"bg-red-500 hover:bg-red-600 dark:bg-red-700 hover:dark:bg-red-600"}/>
                </div>
            </Container>
        </ModalWrapper>
);
};

export default SummaryModal;