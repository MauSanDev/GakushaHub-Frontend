import ReactDOM from "react-dom";
import { FaRedo, FaTimes } from "react-icons/fa";

interface SummaryModalProps {
    correctCount: number;
    incorrectCount: number;
    totalCards: number;
    onRetryIncorrect: () => void;
    onRetryAll: () => void;
    onClose: () => void;
}

const SummaryModal = ({
                          correctCount,
                          incorrectCount,
                          totalCards,
                          onRetryIncorrect,
                          onRetryAll,
                          onClose,
                      }: SummaryModalProps) => {
    const completionPercentage = Math.round((correctCount / totalCards) * 100);

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300 opacity-100">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white w-11/12 md:w-1/2 lg:w-1/3 transition-transform duration-500 transform scale-105 hover:scale-110 ease-in-out">
                <h2 className="text-3xl font-bold mb-4 text-center">Deck Completed!</h2>
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <svg className="w-28 h-28">
                            <circle
                                className="text-gray-600 dark:text-gray-300"
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
                        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                            {completionPercentage}%
                        </span>
                    </div>
                </div>
                <p className="text-lg text-center mb-4">
                    Correct: <span className="text-green-400 font-bold">{correctCount}</span> / {totalCards}
                </p>
                <p className="text-lg text-center mb-6">
                    Incorrect: <span className="text-red-400 font-bold">{incorrectCount}</span> / {totalCards}
                </p>
                <div className="flex justify-center gap-4">
                    {incorrectCount > 0 && (
                        <button
                            onClick={onRetryIncorrect}
                            className="bg-blue-500 dark:bg-gray-700 hover:bg-blue-600 dark:hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 transform transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95"
                        >
                            <FaRedo />
                            Retry Incorrect
                        </button>
                    )}
                    <button
                        onClick={onRetryAll}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 transform transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95"
                    >
                        <FaRedo />
                        Retry All
                    </button>
                    <button
                        onClick={() => {
                            onClose(); // Cerrar el modal de resumen y también el FlashcardsModal
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 transform transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95"
                    >
                        <FaTimes />
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root")!
    );
};

export default SummaryModal;