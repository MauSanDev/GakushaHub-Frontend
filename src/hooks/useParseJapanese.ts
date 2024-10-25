import {useQuery} from 'react-query';
import { ApiClient } from '../services/ApiClient';
import {marked} from 'marked';

interface ParsedTextResult {
    processedText: string;
}

const fetchParsedText = async (text: string): Promise<ParsedTextResult> => {
    return ApiClient.get<ParsedTextResult>(`/api/parse?text=${encodeURIComponent(text)}`);
};

const parseToHtml = async (processedText: string): Promise<string> => {
    const htmlText = await marked(processedText);
    return htmlText.replace(/\[(.*?)\]/g, (_, p1) => {
        return '<span class="relative tooltip-trigger cursor-pointer hover:bg-yellow-200 hover:dark:bg-blue-900 m-0 inline-block indent-0" data-word="' + p1.replace(/\((.*?)\|.*?\)/g, '$1') + '" >'
            + p1.replace(/\((.*?)\|(.*?)\)/g, '<ruby>$1<rt>$2</rt></ruby>') + '</span>';
    })
        .replace(/<h1>/g, '<h1 class="description-2xl font-bold pb-5 description-black dark:description-white align-center">')
        .replace(/<h2>/g, '<h2 class="description-m font-bold pb-2 pt-5 description-black dark:description-white align-center">');
};

export const useParseJapanese = (text: string) => {
    return useQuery(['parsedText', text], async () => {
        const { processedText } = await fetchParsedText(text);
        return parseToHtml(processedText);
    }, {
        staleTime: 5 * 60 * 1000,
    });
};