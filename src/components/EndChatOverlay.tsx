import React, { useEffect, useCallback, useMemo } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useChatContext } from '../context/ChatContext';

export const EndChatOverlay: React.FC = () => {
  const { rating, setRating, setShowEndChatOverlay } = useChatContext();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 250 });
    scale.value = withSpring(1, { damping: 28, stiffness: 220, mass: 1 });
  }, [opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleSubmit = useCallback(() => {
    Alert.alert(
      'Thank you!',
      `Your rating of ${rating} stars has been captured.`,
      [
        {
          text: 'OK',
          onPress: () => setShowEndChatOverlay(false),
        },
      ]
    );
  }, [rating, setShowEndChatOverlay]);

  const handleCancel = useCallback(() => {
    setShowEndChatOverlay(false);
  }, [setShowEndChatOverlay]);

  const submitButtonStyle = useMemo(
    () => [styles.submitButton, rating === 0 && styles.submitButtonDisabled],
    [rating]
  );

  return (
    <View style={styles.overlay}>
      <View style={styles.blur} />
      <Animated.View style={[styles.content, animatedStyle]}>
        <Text style={styles.title}>How was your session?</Text>
        <Text style={styles.subtitle}>Rate your experience with Astrologer Vikram</Text>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}>
              <Text style={styles.star}>
                {star <= rating ? '⭐' : '☆'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.thankYou}>
          Thank you for using MyNaksh 🌙
        </Text>

        <TouchableOpacity
          onPress={handleSubmit}
          style={submitButtonStyle}
          disabled={rating === 0}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCancel}
          style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  starButton: {
    padding: 4,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    fontSize: 36,
    width: 40,
    height: 40,
    textAlign: 'center',
    lineHeight: 40,
  },
  thankYou: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 12,
    padding: 8,
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 14,
  },
});
