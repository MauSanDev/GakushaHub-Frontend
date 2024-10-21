import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { fetchFullPagination, createElement } from '../../../services/dataService.ts';
import { PaginatedData } from '../../../data/PaginatedData';
import { useAuth } from "../../../context/AuthContext";
import { ChatMessageData } from "../../../data/ChatMessageData.ts";
import { CollectionTypes } from "../../../data/CollectionTypes.tsx";

export const useChatMessages = (
    studyGroupId: string,
    page: number,
    limit: number
): {
    fetchMessages: () => Promise<void>,
    sendMessage: (messageContent: string) => Promise<void>,
    isLoading: boolean,
    isSending: boolean,
    data?: PaginatedData<ChatMessageData>,
    resetQueries: () => void
} => {
    const { userData } = useAuth();
    const queryClient = useQueryClient();
    const [data, setData] = useState<PaginatedData<ChatMessageData> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSending, setIsSending] = useState<boolean>(false);

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const filters = {
                studyGroupId: [studyGroupId]
            };

            const result = await fetchFullPagination<ChatMessageData>(
                page,
                limit,
                CollectionTypes.Chat,
                queryClient,
                filters,
                {},
                {},
                userData?._id,
                [],
                true
            );

            setData((prevData) => {
                const newMessages = result?.documents.filter(msg => !prevData?.documents.some(prev => prev._id === msg._id));
                return prevData ? { ...prevData, documents: [...prevData.documents, ...newMessages] } : result;
            });
        } catch (error) {
            console.error('Error fetching messages:', error);
            setData(undefined);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async (messageContent: string) => {
        setIsSending(true);
        try {
            const newMessage = {
                studyGroupId,
                userId: userData?._id,
                message: messageContent,
                timestamp: new Date().toISOString(),
                status: 'normal',
            };

            await createElement(CollectionTypes.Chat, newMessage, queryClient);
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const resetQueries = () => {
        queryClient.invalidateQueries('messages');
    };

    return {
        data,
        isLoading,
        isSending,
        fetchMessages,
        sendMessage,
        resetQueries,
    };
};