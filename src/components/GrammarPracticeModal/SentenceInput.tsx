import { FaMinus, FaClipboardCheck, FaCommentDots, FaSpinner } from "react-icons/fa";
import { useState, useEffect } from "react";
import { GrammarData } from "../../data/GrammarData.ts";
import ConfigDropdown from "../ConfigDropdown.tsx";
import { useCorrectGrammar } from "../../hooks/useCorrectGrammar";
import i18n from "i18next";

interface SentenceInputProps {
    index: number;
    onRemove: (index: number) => void;
    isLast: boolean;
    grammarData: GrammarData;
}

const SentenceInput = ({ index, onRemove, isLast, grammarData }: SentenceInputProps) => {
    const [sentence, setSentence] = useState<string>('');
    const [score, setScore] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<string>('');
    const [correction, setCorrection] = useState<string>('');

    const { mutate: correctGrammar, data: correctionResponse, isLoading } = useCorrectGrammar();

    const handleCorrection = () => {
        if (sentence === "") return;

        correctGrammar({
            sentence,
            grammarStructure: grammarData.structure,
            example1: i18n.getFixedT("ja", "grammar_jlpt"+grammarData.jlpt)(grammarData.examples[1].replace("example", "examples.example"), ""),
            example2: i18n.getFixedT("ja", "grammar_jlpt"+grammarData.jlpt)(grammarData.examples[2].replace("example", "examples.example"), ""),
        });
    };

    useEffect(() => {
        if (correctionResponse) {
            setScore(correctionResponse.score);
            setFeedback(correctionResponse.feedback || "No feedback provided.");
            setCorrection(correctionResponse.correction || "No correction needed.");
        }
    }, [correctionResponse]);

    const getScoreColor = (score: number) => {
        if (score >= 0 && score <= 4) return "red";
        if (score >= 5 && score <= 6) return "orange";
        if (score >= 7 && score <= 10) return "green";
        return "gray";
    };

    const dropdownItems = [
        <div key="feedback" className={"text-white text-xs"}>
            <strong>Feedback:</strong> {feedback}
        </div>,
        <div key="correction" className={"text-white text-xs"}>
            <strong>Correction:</strong> {correction}
        </div>
    ];

    return (
        <div className="flex flex-col mb-4">
            <div className="flex items-center mb-2">
                <input
                    type="text"
                    value={sentence}
                    onChange={(e) => setSentence(e.target.value)}
                    maxLength={120}
                    className={`w-full p-2 bg-transparent border-b focus:outline-none text-white ${
                        isLoading || score !== null ? 'cursor-not-allowed' : ''
                    }`}
                    style={{
                        borderColor: score !== null ? getScoreColor(score!) : 'gray',
                    }}
                    disabled={isLoading || score !== null}  // Deshabilita cuando está esperando la respuesta
                    placeholder="文を書いてください"
                />
                {score === null ? (
                    <>
                        <button
                            onClick={() => onRemove(index)}
                            className="ml-1 p-2 text-white bg-gray-900 hover:bg-red-500 rounded-full text-xs transition-all"
                            disabled={isLast || isLoading}  // Deshabilita mientras espera la corrección
                        >
                            <FaMinus />
                        </button>
                        <button
                            onClick={handleCorrection}
                            className="ml-1 p-2 text-white bg-gray-900 hover:bg-green-500 rounded-full text-xs transition-all"
                            disabled={isLoading}  // Deshabilita mientras espera la corrección
                        >
                            {isLoading ? (
                                <FaSpinner className="animate-spin" />  // Ícono de reloj mientras está cargando
                            ) : (
                                <FaClipboardCheck />
                            )}
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