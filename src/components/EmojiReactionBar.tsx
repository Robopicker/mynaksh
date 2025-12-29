import React, { useEffect, useCallback, memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface EmojiReactionBarProps {
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
}

const EMOJIS = ['🙏', '✨', '🌙', '❤️', '👍'];

const EmojiButton: React.FC<{
  emoji: string;
  index: number;
  onPress: () => void;
}> = memo(({ emoji, index, onPress }) => {
  const scale = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    scale.value = withDelay(
      index * 40,
      withSpring(1, { damping: 18, stiffness: 250, mass: 0.4 })
    );
    translateY.value = withDelay(
      index * 40,
      withSpring(0, { damping: 18, stiffness: 250, mass: 0.4 })
    );
  }, [index, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity onPress={onPress} style={styles.emojiButton}>
        <Text style={styles.emoji}>{emoji}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

export const EmojiReactionBar: React.FC<EmojiReactionBarProps> = memo(({
  onSelectEmoji,
  onClose,
}) => {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 30, stiffness: 300, mass: 0.6 });
    opacity.value = withTiming(1, { duration: 150 });
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleSelect = useCallback(
    (emoji: string) => {
      onSelectEmoji(emoji);
      onClose();
    },
    [onSelectEmoji, onClose]
  );

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <Animated.View style={[styles.container, animatedStyle]}>
        {EMOJIS.map((emoji, index) => (
          <EmojiButton
            key={emoji}
            emoji={emoji}
            index={index}
            onPress={() => handleSelect(emoji)}
          />
        ))}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  emojiButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emoji: {
    fontSize: 28,
  },
});
