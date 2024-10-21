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

            // Añadimos las sortingOptions para ordenar por 'timestamp' en orden descendente
            const sortingOptions = {
                timestamp: -1
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
                true,
                sortingOptions
        );

            setData(prevData => {
                if (!result) return prevData;

                const updatedDocuments = prevData?.documents.map(prevMsg => {
                    const newMsg = result.documents.find(newMsg => newMsg._id === prevMsg._id);
                    return newMsg || prevMsg;
                }) || [];

                const additionalNewMessages = result.documents.filter(newMsg =>
                    !prevData?.documents.some(prevMsg => prevMsg._id === newMsg._id)
                );

                const allMessages = [...updatedDocuments, ...additionalNewMessages];

                // Ordenar los mensajes por timestamp
                allMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

                return {
                    documents: allMessages,
                    page: result.page,
                    totalPages: result.totalPages,
                    limit: result.limit,
                    totalDocuments: result.totalDocuments,
                };
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
            fetchMessages(); // Refrescar mensajes después de enviar
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