import React, { useEffect } from 'react';
import { useWords } from '../hooks/useWords';

interface WordTooltipProps {
    word: string;
    targetElement: Element;
    onClose: () => void;
}

const WordTooltip: React.FC<WordTooltipProps> = ({ word, targetElement, onClose }) => {
    const { data: wordDataList, isLoading, error } = useWords([word]);

    useEffect(() => {
        if (wordDataList && wordDataList.length > 0) {
            const wordData = wordDataList[0];
            const tooltip = document.createElement('span');
            tooltip.className =
                'tooltip-content border-gray-300 border indent-0 absolute left-0 top-full mb-2 p-2 bg-white text-black rounded opacity-0 transition-opacity duration-300 whitespace-normal z-50';
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 0.3s';
            tooltip.style.width = '300px';
            tooltip.style.letterSpacing = '1';
            tooltip.style.lineHeight = '1';
            tooltip.innerHTML = `
                <span class="font-bold text-blue-500 text-m">${wordData.word}</span>
                <span class="text-gray-500 text-xs">(${wordData.readings.join(';')})</span> <br>
                <span class="text-gray-800 text-xs">${wordData.meanings.map((meaning) => meaning.en).slice(0, 3).join('; ')}</span>
            `;

            targetElement.appendChild(tooltip);

            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 0);

            return () => {
                tooltip.remove();
            };
        }
    }, [wordDataList, targetElement]);

    useEffect(() => {
        if (error) {
            console.error('Error fetching word data:', error);
            onClose();
        }
    }, [error, onClose]);

    if (isLoading || !wordDataList || wordDataList.length === 0) {
        return null;
    }

    return null;
};

export default WordTooltip;