export interface ChatMessageData {
    _id: string;
    userId: string;
    message: string;
    timestamp: string;
    status: 'normal' | 'edited' | 'deleted';
}