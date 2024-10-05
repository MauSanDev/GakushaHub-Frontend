import {FaMinus, FaClipboardCheck, FaCommentDots} from "react-icons/fa";
import { useState } from "react";
import { GrammarData } from "../../data/GrammarData.ts";
import ConfigDropdown from "../ConfigDropdown.tsx";  // Asegúrate de importar el componente ConfigDropdown

interface SentenceInputProps {
    index: number;
    onRemove: (index: number) => void;
    isLast: boolean;
    grammarData: GrammarData;
}

const SentenceInput = ({ index, onRemove, isLast, grammarData }: SentenceInputProps) => {
    const [sentence, setSentence] = useState<string>('');
    const [score, setScore] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<string>('This is placeholder feedback');
    const [correction, setCorrection] = useState<string>('This is a placeholder correction');

    const handleCorrection = () => {
        if (sentence === "") return;

        const randomScore = Math.floor(Math.random() * 10) + 1;
        setScore(randomScore);

        setFeedback(grammarData.structure)
        setCorrection("grammarData.structure")
    };

    const getScoreColor = (score: number) => {
        if (score >= 1 && score <= 4) return "red";
        if (score >= 5 && score <= 6) return "orange";
        if (score >= 7 && score <= 10) return "green";
        return "gray";
    };

    const dropdownItems = [
        <div key="feedback" className={"text-white text-xs"}>
            <strong>Feedback:</strong> {feedback}
        </div>,
        <div key="correction" className={"text-white text-xs"}>
            <strong>Correction:</strong> {correction}f
        </div>
    ];

    return (
        <div className="flex flex-col mb-4"> {/* Contenedor general */}
            <div className="flex items-center mb-2">
                <input
                    type="text"
                    value={sentence}
                    onChange={(e) => setSentence(e.target.value)}
                    maxLength={120}
                    className={`w-full p-2 bg-transparent border-b focus:outline-none text-white ${
                        score !== null ? 'cursor-not-allowed' : ''
                    }`}
                    style={{
                        borderColor: score !== null ? getScoreColor(score!) : 'gray',
                    }}
                    disabled={score !== null}
                    placeholder="Enter your sentence"
                />
                {score === null ? (
                    <>
                        <button
                            onClick={() => onRemove(index)}
                            className="ml-1 p-2 text-white bg-gray-900 hover:bg-red-500 rounded-full text-xs"
                            disabled={isLast}
                        >
                            <FaMinus />
                        </button>
                        <button
                            onClick={handleCorrection}
                            className="ml-1 p-2 text-white bg-gray-900 hover:bg-green-500 rounded-full text-xs"
                        >
                            <FaClipboardCheck />
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className={`ml-2 pl-2 rounded-full text-xs text-white inline-flex items-center`}
                            style={{ backgroundColor: getScoreColor(score!) }}
                        >
                            <span className={"font-bold"}>{score}/10</span>
                            <ConfigDropdown
                                items={dropdownItems}
                                icon={<FaCommentDots />}
                                buttonSize="text-xs"
                                baseColor={getScoreColor(score)}
                                hoverColor={getScoreColor(score)}
                            />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default SentenceInput;