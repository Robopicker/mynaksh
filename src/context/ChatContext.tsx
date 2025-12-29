import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Message, FeedbackType, DislikeFeedbackReason } from '../types/chat';
import { MOCK_MESSAGES } from '../data/mockMessages';

interface ChatContextType {
  messages: Message[];
  replyingTo: Message | null;
  showEndChatOverlay: boolean;
  rating: number;
  setReplyingTo: (message: Message | null) => void;
  addReaction: (messageId: string, emoji: string) => void;
  setFeedback: (messageId: string, feedback: FeedbackType) => void;
  setDislikeReason: (messageId: string, reason: DislikeFeedbackReason) => void;
  setShowEndChatOverlay: (show: boolean) => void;
  setRating: (rating: number) => void;
  sendMessage: (text: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showEndChatOverlay, setShowEndChatOverlay] = useState(false);
  const [rating, setRating] = useState(0);

  const addReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, reaction: emoji } : msg
      )
    );
  };

  const setFeedback = (messageId: string, feedback: FeedbackType) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, feedbackType: feedback, dislikeReason: feedback === 'disliked' ? msg.dislikeReason : undefined }
          : msg
      )
    );
  };

  const setDislikeReason = (messageId: string, reason: DislikeFeedbackReason) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, dislikeReason: reason } : msg
      )
    );
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: Date.now(),
      type: 'text',
      replyTo: replyingTo?.id,
    };

    setMessages((prev) => [...prev, newMessage]);
    setReplyingTo(null);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        replyingTo,
        showEndChatOverlay,
        rating,
        setReplyingTo,
        addReaction,
        setFeedback,
        setDislikeReason,
        setShowEndChatOverlay,
        setRating,
        sendMessage,
      }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};
