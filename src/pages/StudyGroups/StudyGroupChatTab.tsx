import React, { useState, useEffect, useRef } from 'react';
import { StudyGroupData } from '../../data/Institutions/StudyGroupData';
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import { FaPaperPlane } from "react-icons/fa";
import { MembershipRole } from "../../data/MembershipData.ts";
import NoDataMessage from "../../components/NoDataMessage.tsx";
import ChatMessageBox from './Chat/ChatMessageBox.tsx';
import ChatDaySeparator from './Chat/ChatDaySeparator.tsx';

interface Message {
    id: string;
    userId: string;
    userName: string;
    avatarUrl: string;
    message: string;
    timestamp: string;
}

interface StudyGroupChatProps {
    studyGroup: StudyGroupData;
    canEdit: boolean;
    role: MembershipRole;
}

const StudyGroupChat: React.FC<StudyGroupChatProps> = ({ studyGroup, canEdit, role }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            userId: 'user1',
            userName: 'Guest',
            avatarUrl: 'https://via.placeholder.com/150',
            message: 'Esto es un ejemplo de mensaje de otro usuario.',
            timestamp: '2023-10-20 21:54'
        },
        {
            id: '2',
            userId: 'user2',
            userName: 'You',
            avatarUrl: 'https://via.placeholder.com/150',
            message: 'Este es tu mensaje, alineado a la derecha.',
            timestamp: '2023-10-21 08:30'
        },
        {
            id: '3',
            userId: 'user1',
            userName: 'Guest',
            avatarUrl: 'https://via.placeholder.com/150',
            message: 'Otro mensaje del día siguiente.',
            timestamp: '2023-10-21 09:45'
        }
    ]);
    const [newMessage, setNewMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg: Message = {
                id: String(Date.now()),
                userId: 'user2',
                userName: 'You',
                avatarUrl: 'https://via.placeholder.com/150',
                message: newMessage,
                timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ') // YYYY-MM-DD HH:mm
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const formatDate = (timestamp: string) => {
        return timestamp.slice(0, 10); // YYYY-MM-DD
    };

    // Mantiene el scroll en la parte inferior cuando se agregan nuevos mensajes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col w-full max-w-4xl text-white p-4 rounded-lg h-full">
            <div className="flex-grow overflow-y-auto p-4 flex flex-col-reverse" style={{ height: 'calc(80vh - 160px)' }}>
                <div className="flex flex-col space-y-1">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => {
                            const prevMessage = messages[index - 1];
                            const currentDate = formatDate(msg.timestamp);
                            const prevDate = prevMessage ? formatDate(prevMessage.timestamp) : '';

                            return (
                                <React.Fragment key={msg.id}>
                                    {currentDate !== prevDate && <ChatDaySeparator date={currentDate} />}
                                    <ChatMessageBox
                                        userName={msg.userName}
                                        avatarUrl={msg.avatarUrl}
                                        message={msg.message}
                                        timestamp={msg.timestamp}
                                        isUser={msg.userId === 'user2'}
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
                    disabled={!canEdit}
                />
                <PrimaryButton
                    onClick={handleSendMessage}
                    label="Send"
                    iconComponent={<FaPaperPlane />}
                    className="ml-2"
                    disabled={!canEdit}
                />
            </div>
        </div>
    );
};

export default StudyGroupChat;