import { Message } from '../types/chat';

export const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'system',
    text: 'Session with Astrologer Vikram started',
    timestamp: 1734681480000,
    type: 'event',
  },
  {
    id: '2',
    sender: 'user',
    text: 'Namaste, feeling really anxious about my job situation. Can you check my chart?',
    timestamp: 1734681600000,
    type: 'text',
  },
  {
    id: '3',
    sender: 'ai_astrologer',
    text: 'Namaste! Looking at your chart, you are in Shani Mahadasha right now. It brings challenges but makes you stronger.',
    timestamp: 1734681660000,
    type: 'ai',
    hasFeedback: true,
    feedbackType: 'liked',
  },
  {
    id: '4',
    sender: 'human_astrologer',
    text: 'Yes, Saturn is moving through your 6th house. That explains the heavy workload.',
    timestamp: 1734681720000,
    type: 'human',
  },
  {
    id: '5',
    sender: 'user',
    text: 'Any remedy? Hard to focus these days',
    timestamp: 1734681780000,
    type: 'text',
    replyTo: '4',
  },
  {
    id: '6',
    sender: 'ai_astrologer',
    text: 'Chant Shani Mantra 108 times every Saturday. Want me to share the mantra?',
    timestamp: 1734681840000,
    type: 'ai',
    hasFeedback: false,
  },
];
