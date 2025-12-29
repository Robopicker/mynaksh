import React, { useEffect, memo, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { DislikeFeedbackReason } from '../types/chat';

interface FeedbackChipsProps {
  onSelectReason: (reason: DislikeFeedbackReason) => void;
  selectedReason?: DislikeFeedbackReason;
}

const REASONS: DislikeFeedbackReason[] = ['Inaccurate', 'Too Vague', 'Too Long'];

export const FeedbackChips: React.FC<FeedbackChipsProps> = memo(({
  onSelectReason,
  selectedReason,
}) => {
  return (
    <View style={styles.container}>
      {REASONS.map((reason, index) => (
        <ChipItem
          key={reason}
          reason={reason}
          index={index}
          isSelected={selectedReason === reason}
          onPress={() => onSelectReason(reason)}
        />
      ))}
    </View>
  );
});

const ChipItem: React.FC<{
  reason: DislikeFeedbackReason;
  index: number;
  isSelected: boolean;
  onPress: () => void;
}> = memo(({ reason, index, isSelected, onPress }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      index * 50,
      withSpring(1, { damping: 20, stiffness: 180, mass: 0.5 })
    );
    opacity.value = withDelay(index * 50, withSpring(1, { damping: 20 }));
  }, [index, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const chipStyle = useMemo(
    () => [styles.chip, isSelected && styles.chipSelected],
    [isSelected]
  );

  const textStyle = useMemo(
    () => [styles.chipText, isSelected && styles.chipTextSelected],
    [isSelected]
  );

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity onPress={onPress} style={chipStyle}>
        <Text style={textStyle}>{reason}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipSelected: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  chipText: {
    fontSize: 12,
    color: '#666',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});
