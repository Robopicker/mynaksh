export type MessageSender = 'system' | 'user' | 'ai_astrologer' | 'human_astrologer';
export type MessageType = 'event' | 'text' | 'ai' | 'human';
export type FeedbackType = 'liked' | 'disliked' | null;
export type DislikeFeedbackReason = 'Inaccurate' | 'Too Vague' | 'Too Long';

export interface Message {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: number;
  type: MessageType;
  hasFeedback?: boolean;
  feedbackType?: FeedbackType;
  replyTo?: string;
  reaction?: string;
  dislikeReason?: DislikeFeedbackReason;
}

export interface ChatState {
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
}
