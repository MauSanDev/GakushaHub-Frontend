import React from 'react';
import {FaRedo, FaRandom, FaAlignLeft, FaCog} from 'react-icons/fa';
import TooltipButton from "../TooltipButton.tsx";
import LabelButton from "../ui/buttons/LabelButton.tsx";

interface SettingsTooltipProps {
    onReset: () => void;
    onToggleShuffle: () => void;
    isShuffleEnabled: boolean;
    onToggleOrientation: () => void;
    isTermFirst: boolean;
}

const SettingsTooltip: React.FC<SettingsTooltipProps> = ({
                                                             onReset,
                                                             onToggleShuffle,
                                                             isShuffleEnabled,
                                                             onToggleOrientation,
                                                             isTermFirst,
                                                         }) => {
    const items = [
        
        <LabelButton iconComponent={<FaRedo />} label={"flashcardsModal.resetDeck"} onClick={onReset} />,
        <LabelButton iconComponent={<FaRandom />} label={"flashcardsModal.shuffle"} onClick={onToggleShuffle} value={isShuffleEnabled ? "on" : "off"}/>,
        <LabelButton iconComponent={<FaAlignLeft />} label={"flashcardsModal.orientation"} onClick={onToggleOrientation} value={isTermFirst ? "flashcardsModal.termReading" : "flashcardsModal.readingTerm"}/>,
    ];

    return (
        <TooltipButton
            items={items}
            icon={<FaCog />}
            buttonSize="text-lg"
            baseColor="bg-gray-800"
            hoverColor="hover:bg-gray-600"
        />
    );
};

export default SettingsTooltip;