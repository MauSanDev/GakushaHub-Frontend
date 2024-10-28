import React, { useState, useEffect, useRef } from 'react';
import { StudyGroupData } from '../../data/Institutions/StudyGroupData';
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import { MembershipRole } from "../../data/MembershipData.ts";
import NoDataMessage from "../../components/NoDataMessage.tsx";
import ChatMessageBox from './Chat/ChatMessageBox.tsx';
import ChatDaySeparator from './Chat/ChatDaySeparator.tsx';
import { useChatMessages } from '../../hooks/newHooks/Chat/useChatMessages';
import {useTranslation} from "react-i18next";

interface StudyGroupChatProps {
    studyGroup: StudyGroupData;
    canEdit: boolean;
    role: MembershipRole;
}

const StudyGroupChat: React.FC<StudyGroupChatProps> = ({ studyGroup, role }) => {
    const [newMessage, setNewMessage] = useState<string>('');
    const [page, setPage] = useState<number>(1);  
    const [maxPage, setMaxPage] = useState<number>(1);  
    const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false); 

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const { t } = useTranslation();

    const { data, isLoading, fetchMessages, sendMessage, isSending } = useChatMessages(studyGroup._id, page, 10);

    useEffect(() => {
        fetchMessages();
    }, [newMessage]);

    
    useEffect(() => {
        const interval = setInterval(() => {
            fetchMessages(1);  
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    
    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            
            if (scrollTop  <= clientHeight - scrollHeight && !isFetchingMore && (maxPage > page)) {
                setIsFetchingMore(true);
                const valToFetch =  Math.min(page + 1, maxPage);
                setPage(valToFetch);
                fetchMessages(valToFetch).finally(() => setIsFetchingMore(false)); 
            }
        }
    };
    
    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            try {
                await sendMessage(newMessage);
                setNewMessage('');
                fetchMessages(1);  
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const formatDate = (timestamp: string) => {
        return timestamp.slice(0, 10);
    };

    useEffect(() => {
        if (data) {
            setMaxPage(data.totalPages)
        }
    }, [data]);
    
    useEffect(() => {
        if (page === 1 && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [data, page]);

    
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (chatContainerRef.current) {
                chatContainerRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [chatContainerRef]);

    return (
        <div className="flex flex-col w-full max-w-4xl text-white p-4 rounded-lg h-full relative">
            {isLoading && (
                <div className="absolute bottom-20 left-4 flex items-center text-gray-400">
                    <FaSpinner className="animate-spin mr-2" />
                    <span>Loading...</span>
                </div>
            )}

            <div
                className="flex-grow overflow-y-auto p-4 flex flex-col-reverse"
                ref={chatContainerRef}
                onScroll={handleScroll} 
                style={{ height: 'calc(80vh - 160px)', overflowY: 'auto' }} 
            >
                <div className="flex flex-col space-y-1">
                    {isFetchingMore && ( 
                        <div className="flex justify-center">
                            <FaSpinner className="animate-spin text-gray-400" />
                        </div>
                    )}
                    {data && data.documents.length > 0 ? (
                        data.documents.map((msg, index) => {
                            const prevMessage = data.documents[index - 1];
                            const currentDate = formatDate(msg.timestamp);
                            const prevDate = prevMessage ? formatDate(prevMessage.timestamp) : '';

                            return (
                                <React.Fragment key={msg._id}>
                                    {currentDate !== prevDate && <ChatDaySeparator date={currentDate} />}
                                    <ChatMessageBox
                                        messageData={msg}
                                        viewerRole={role}
                                    />
                                </React.Fragment>
                            );
                        })
                    ) : (
                        <NoDataMessage />
                    )}
                    <div ref={messagesEndRef}></div>
                </div>
            </div>

            <div className="mt-4 flex items-center">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="input-field"
                    placeholder={t("institution.chatKeys.writeMessage")}
                    disabled={isSending}
                />
                <PrimaryButton
                    onClick={handleSendMessage}
                    label="institution.chatKeys.send"
                    iconComponent={<FaPaperPlane />}
                    className="ml-2"
                    disabled={isSending || newMessage.trim() === ''}
                />
            </div>
        </div>
    );
};

export default StudyGroupChat;