import React, { useState, useEffect } from 'react';
import { WordData } from '../data/WordData.ts';

interface TooltipProps {
    word: string;
    targetElement: Element;
    onClose: () => void;
}

const Tooltip: React.FC<TooltipProps> = ({ word, targetElement, onClose }) => {
    const [wordData, setWordData] = useState<WordData | null>(null);

    useEffect(() => {
        const fetchWordData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/words?keywords=${word}`);
                if (!response.ok) {
                    throw new Error(`Error en la API: ${response.statusText}`);
                }
                const data = await response.json();
                setWordData(data[0]);
            } catch (error) {
                console.error('Error fetching word data:', error);
                onClose(); // Close the tooltip on error
            }
        };

        fetchWordData();

        return () => {
            // Clean up when the component is unmounted
            document.querySelectorAll('.tooltip-content').forEach((tooltip) => tooltip.remove());
        };
    }, [word, onClose]);

    useEffect(() => {
        if (wordData) {
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
        }
    }, [wordData, targetElement]);

    return null;
};

export default Tooltip;