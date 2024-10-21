import React, { useState, useEffect, useRef } from 'react';
import { StudyGroupData } from '../../data/Institutions/StudyGroupData';
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import { MembershipRole } from "../../data/MembershipData.ts";
import NoDataMessage from "../../components/NoDataMessage.tsx";
import ChatMessageBox from './Chat/ChatMessageBox.tsx';
import ChatDaySeparator from './Chat/ChatDaySeparator.tsx';
import { useChatMessages } from '../../hooks/newHooks/Chat/useChatMessages';

interface StudyGroupChatProps {
    studyGroup: StudyGroupData;
    canEdit: boolean;
    role: MembershipRole;
}

const StudyGroupChat: React.FC<StudyGroupChatProps> = ({ studyGroup, canEdit, role }) => {
    const [newMessage, setNewMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const { data, isLoading, fetchMessages, sendMessage, isSending } = useChatMessages(studyGroup._id, 1, 50);

    
    useEffect(() => {
        fetchMessages(); 
    }, []);

    
    useEffect(() => {
        const interval = setInterval(() => {
            fetchMessages(); 
        }, 5000);

        return () => clearInterval(interval); 
    }, []);

    
    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            try {
                await sendMessage(newMessage); 
                setNewMessage('');
                fetchMessages(); 
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
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [data]);

    return (
        <div className="flex flex-col w-full max-w-4xl text-white p-4 rounded-lg h-full relative">
            {isLoading && (
                <div className="absolute bottom-20 left-4 flex items-center text-gray-400">
                    <FaSpinner className="animate-spin mr-2" />
                    <span>Loading...</span>
                </div>
            )}

            <div className="flex-grow overflow-y-auto p-4 flex flex-col-reverse" style={{ height: 'calc(80vh - 160px)' }}>
                <div className="flex flex-col space-y-1">
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
                    placeholder="Write your message..."
                    disabled={!canEdit || isSending}
                />
                <PrimaryButton
                    onClick={handleSendMessage}
                    label="Send"
                    iconComponent={<FaPaperPlane />}
                    className="ml-2"
                    disabled={!canEdit || isSending || newMessage.trim() === ''}
                />
            </div>
        </div>
    );
};

export default StudyGroupChat;