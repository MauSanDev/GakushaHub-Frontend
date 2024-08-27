import { useState } from "react";
import { FaCog, FaRedo, FaRandom, FaAlignLeft } from "react-icons/fa";

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

    return (
        <div className="relative">
            {/* Botón de configuración */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="text-white p-2 rounded-full shadow-lg bg-gray-800 hover:bg-gray-600"
            >
                <FaCog />
            </button>

            {/* Tooltip */}
            {isOpen && (
                <div
                    className={`absolute top-12 right-0 w-48 bg-gray-900 text-white rounded-lg shadow-lg p-4 z-50 transition-transform duration-300 ease-in-out transform ${
                        isOpen ? "scale-100" : "scale-0"
                    }`}
                >
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 w-full py-2 px-4 hover:bg-gray-800 rounded"
                    >
                        <FaRedo />
                        Reset Deck
                    </button>
                    <button
                        onClick={onToggleShuffle}
                        className="flex items-center gap-2 w-full py-2 px-4 hover:bg-gray-800 rounded"
                    >
                        <FaRandom />
                        Shuffle: {isShuffleEnabled ? "On" : "Off"}
                    </button>
                    <button
                        onClick={onToggleOrientation}
                        className="flex items-center gap-2 w-full py-2 px-4 hover:bg-gray-800 rounded"
                    >
                        <FaAlignLeft />
                        Orientation: {isTermFirst ? "Term -> Reading" : "Reading -> Term"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SettingsTooltip;