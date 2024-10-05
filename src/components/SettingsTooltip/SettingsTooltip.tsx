import { useState, useEffect, useRef } from "react";
import { FaCog, FaRedo, FaRandom, FaAlignLeft } from "react-icons/fa";
import LocSpan from "../LocSpan.tsx";

interface SettingsTooltipProps {
    onReset: () => void;
    onToggleShuffle: () => void;
    isShuffleEnabled: boolean;
    onToggleOrientation: () => void;
    isTermFirst: boolean;
}

const SettingsTooltip = ({
                             onReset,
                             onToggleShuffle,
                             isShuffleEnabled,
                             onToggleOrientation,
                             isTermFirst,
                         }: SettingsTooltipProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={tooltipRef}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="text-white p-2 rounded-full shadow-lg bg-gray-800 hover:bg-gray-600"
            >
                <FaCog />
            </button>

            {isOpen && (
                <div
                    className={`absolute top-12 right-0 w-48 bg-gray-900 text-white rounded-lg shadow-lg p-4 z-50 transition-transform duration-300 ease-in-out transform ${
                        isOpen ? "scale-100" : "scale-0"
                    }`}
                >
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 w-full py-2 px-4 hover:bg-gray-800 rounded text-xs"
                    >
                        <FaRedo />
                        <LocSpan textKey={"flashcardsModal.resetDeck"} />
                    </button>
                    <button
                        onClick={onToggleShuffle}
                        className="flex items-center gap-2 w-full py-2 px-4 hover:bg-gray-800 rounded text-xs"
                    >
                        <FaRandom />
                        <LocSpan textKey={"flashcardsModal.shuffle"} />:{" "}
                        {isShuffleEnabled ? (
                            <LocSpan textKey={"on"} />
                        ) : (
                            <LocSpan textKey={"off"} />
                        )}
                    </button>
                    <button
                        onClick={onToggleOrientation}
                        className="flex items-center gap-2 w-full py-2 px-4 hover:bg-gray-800 rounded text-xs leading-tight"
                    >
                        <FaAlignLeft />
                        <LocSpan textKey={"flashcardsModal.orientation"} />:{" "}
                        {isTermFirst ? (
                            <LocSpan textKey={"flashcardsModal.termReading"} />
                        ) : (
                            <LocSpan textKey={"flashcardsModal.readingTerm"} />
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SettingsTooltip;