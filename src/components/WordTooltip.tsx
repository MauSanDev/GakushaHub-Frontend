import React, { useEffect, useCallback, useRef } from 'react';
import { useSearchWords } from '../hooks/useSearchWords.ts';
import {useTranslation} from "react-i18next";

interface WordTooltipProps {
    word: string;
    targetElement: Element;
    onClose: () => void;
}

const WordTooltip: React.FC<WordTooltipProps> = ({ word, targetElement, onClose }) => {
    const { mutate: searchWords, data: wordDataList, error, isLoading } = useSearchWords();
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null); // Ref to store the debounce timeout
    const tooltipRef = useRef<HTMLSpanElement | null>(null); // Ref to track the tooltip element
    const { t } = useTranslation();

    const createTooltip = useCallback(() => {
        // Only create the tooltip if it doesn't exist yet
        if (!tooltipRef.current) {
            const tooltip = document.createElement('span');
            tooltip.className =
                'tooltip-content border-gray-300 dark:border-gray-700 border indent-0 absolute left-0 top-full mb-2 p-2 bg-white dark:bg-gray-800 description-black dark:description-white rounded transition-opacity duration-300 whitespace-normal z-50';
            tooltip.style.width = '300px';
            tooltip.style.letterSpacing = '1';
            tooltip.style.lineHeight = '1';
            tooltip.style.opacity = '0';

            tooltipRef.current = tooltip;
            targetElement.appendChild(tooltip);
        }
    }, [targetElement]);

    useEffect(() => {
        createTooltip();

        // Clear previous timeout if it's still pending
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        // Apply debounce to avoid multiple rapid calls
        debounceTimeout.current = setTimeout(() => {
            searchWords([word]);
        }, 300); // 300ms debounce time

        return () => {
            // Clean up: remove tooltip and clear debounce timeout
            if (tooltipRef.current) {
                tooltipRef.current.remove();
                tooltipRef.current = null;
            }

            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [word, searchWords, createTooltip]);
    useEffect(() => {
        if (isLoading && tooltipRef.current) {
            const loadingText = document.createElement('span');
            loadingText.className = 'description-gray-500 dark:description-gray-300 description-xs';
            loadingText.textContent = `${t("loading")}...`;

            tooltipRef.current.innerHTML = ''; // Limpiar el contenido previo
            tooltipRef.current.appendChild(loadingText);
            tooltipRef.current.style.opacity = '1';
        }

        if (wordDataList && wordDataList.length > 0 && tooltipRef.current) {
            const wordData = wordDataList[0];

            const wordText = document.createElement('span');
            wordText.className = 'font-bold description-blue-400 dark:description-white description-m';
            wordText.textContent = wordData.word;

            const readingsText = document.createElement('span');
            readingsText.className = 'description-gray-500 dark:description-gray-300 description-xs';
            readingsText.textContent = `(${wordData.readings.join(';')})`;

            const meaningsText = document.createElement('span');
            meaningsText.className = 'description-gray-800 dark:description-gray-200 description-xs';
            meaningsText.textContent = wordData.meanings.map((meaning) => meaning.en).slice(0, 3).join('; ');

            tooltipRef.current.innerHTML = ''; // Limpiar el contenido previo
            tooltipRef.current.appendChild(wordText);
            tooltipRef.current.appendChild(readingsText);
            tooltipRef.current.appendChild(document.createElement('br'));
            tooltipRef.current.appendChild(meaningsText);
            tooltipRef.current.style.opacity = '1';
        }

        if (error && tooltipRef.current) {
            const errorText = document.createElement('span');
            errorText.className = 'description-red-500 dark:description-red-300 description-xs';
            errorText.textContent = 'Error loading data';

            tooltipRef.current.innerHTML = ''; // Limpiar el contenido previo
            tooltipRef.current.appendChild(errorText);
            tooltipRef.current.style.opacity = '1';
        }
    }, [wordDataList, isLoading, error, t]);

    useEffect(() => {
        if (error) {
            console.error('Error fetching word data:', error);
            onClose();
        }
    }, [error, onClose]);

    return null;
};

export default WordTooltip;