import React, { useState, useMemo, useCallback, memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Message, DislikeFeedbackReason } from '../types/chat';
import { useChatContext } from '../context/ChatContext';
import { EmojiReactionBar } from './EmojiReactionBar';
import { FeedbackChips } from './FeedbackChips';

interface MessageBubbleProps {
  message: Message;
  replyToMessage?: Message;
}

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const MessageBubble: React.FC<MessageBubbleProps> = memo(({
  message,
  replyToMessage,
}) => {
  const { setReplyingTo, addReaction, setFeedback, setDislikeReason } = useChatContext();
  const [showReactions, setShowReactions] = useState(false);
  const [showDislikeFeedback, setShowDislikeFeedback] = useState(false);

  const translateX = useSharedValue(0);
  const replyIconOpacity = useSharedValue(0);

  // Memoize computed message properties
  const isUserMessage = useMemo(() => message.sender === 'user', [message.sender]);
  const isSystemMessage = useMemo(() => message.type === 'event', [message.type]);
  const isAIMessage = useMemo(() => message.sender === 'ai_astrologer', [message.sender]);

  // Memoize formatted time
  const formattedTime = useMemo(() => formatTime(message.timestamp), [message.timestamp]);

  // Memoize gesture handlers
  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!isSystemMessage)
        .activeOffsetX([-5, 5])
        .onUpdate((e) => {
          const clampedTranslation = Math.max(0, Math.min(e.translationX, 80));
          translateX.value = clampedTranslation;
          replyIconOpacity.value = Math.min(clampedTranslation / 40, 1);
        })
        .onEnd((e) => {
          'worklet';
          if (e.translationX > 40) {
            runOnJS(setReplyingTo)(message);
          }
          translateX.value = withSpring(0, {
            damping: 25,
            stiffness: 400,
            mass: 0.5,
          });
          replyIconOpacity.value = withTiming(0, { duration: 200 });
        }),
    [isSystemMessage, message, setReplyingTo, translateX, replyIconOpacity]
  );

  const longPressGesture = useMemo(
    () =>
      Gesture.LongPress()
        .enabled(!isSystemMessage)
        .minDuration(400)
        .onStart(() => {
          runOnJS(setShowReactions)(true);
        }),
    [isSystemMessage]
  );

  const composed = useMemo(
    () => Gesture.Race(longPressGesture, panGesture),
    [longPressGesture, panGesture]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const replyIconStyle = useAnimatedStyle(() => ({
    opacity: replyIconOpacity.value,
  }));

  // Memoize callback handlers
  const handleReaction = useCallback(
    (emoji: string) => {
      addReaction(message.id, emoji);
      setShowReactions(false);
    },
    [addReaction, message.id]
  );

  const handleFeedback = useCallback(
    (type: 'liked' | 'disliked') => {
      setFeedback(message.id, type);
      setShowDislikeFeedback(type === 'disliked');
    },
    [setFeedback, message.id]
  );

  const handleCloseReactions = useCallback(() => {
    setShowReactions(false);
  }, []);

  const handleDislikeReason = useCallback(
    (reason: DislikeFeedbackReason) => {
      setDislikeReason(message.id, reason);
    },
    [setDislikeReason, message.id]
  );

  if (isSystemMessage) {
    return (
      <View style={styles.systemContainer}>
        <Text style={styles.systemText}>{message.text}</Text>
      </View>
    );
  }

  return (
    <View style={styles.messageWrapper}>
      <GestureDetector gesture={composed}>
        <View style={[styles.messageRow, isUserMessage && styles.messageRowUser]}>
          <Animated.View
            style={[
              styles.replyIconContainer,
              replyIconStyle,
              !isUserMessage && styles.replyIconContainerLeft
            ]}>
            <Text style={styles.replyIcon}>↩️</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.bubble,
              isUserMessage ? styles.bubbleUser : styles.bubbleOther,
              animatedStyle,
            ]}>
            {replyToMessage && (
              <View style={styles.replyToContainer}>
                <View style={styles.replyToBar} />
                <Text style={styles.replyToText} numberOfLines={2}>
                  {replyToMessage.text}
                </Text>
              </View>
            )}

            <Text style={[styles.messageText, isUserMessage && styles.messageTextUser]}>
              {message.text}
            </Text>

            <Text style={[styles.timeText, isUserMessage && styles.timeTextUser]}>
              {formattedTime}
            </Text>

            {message.reaction && (
              <View style={styles.reactionBadge}>
                <Text style={styles.reactionText}>{message.reaction}</Text>
              </View>
            )}

            {isAIMessage && message.hasFeedback && (
              <View style={styles.feedbackContainer}>
                <TouchableOpacity
                  onPress={() => handleFeedback('liked')}
                  style={styles.feedbackButton}>
                  <Text style={styles.feedbackIcon}>
                    {message.feedbackType === 'liked' ? '👍' : '👍🏻'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleFeedback('disliked')}
                  style={styles.feedbackButton}>
                  <Text style={styles.feedbackIcon}>
                    {message.feedbackType === 'disliked' ? '👎' : '👎🏻'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {showDislikeFeedback && message.feedbackType === 'disliked' && (
              <FeedbackChips
                onSelectReason={handleDislikeReason}
                selectedReason={message.dislikeReason}
              />
            )}
          </Animated.View>
        </View>
      </GestureDetector>

      {showReactions && (
        <EmojiReactionBar
          onSelectEmoji={handleReaction}
          onClose={handleCloseReactions}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  messageWrapper: {
    marginBottom: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    overflow: 'visible',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  replyIconContainer: {
    marginRight: 8,
    width: 28,
  },
  replyIconContainerLeft: {
    marginRight: -20,
    marginLeft: 0,
  },
  replyIcon: {
    fontSize: 20,
  },
  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    position: 'relative',
  },
  bubbleUser: {
    backgroundColor: '#6366f1',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#1a1a1a',
  },
  messageTextUser: {
    color: '#fff',
  },
  timeText: {
    fontSize: 11,
    color: 'rgba(0, 0, 0, 0.5)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeTextUser: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  systemContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  systemText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  replyToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  replyToBar: {
    width: 2,
    height: 20,
    backgroundColor: '#6366f1',
    marginRight: 6,
  },
  replyToText: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  reactionBadge: {
    position: 'absolute',
    bottom: -8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reactionText: {
    fontSize: 14,
  },
  feedbackContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  feedbackButton: {
    padding: 4,
  },
  feedbackIcon: {
    fontSize: 18,
  },
});
