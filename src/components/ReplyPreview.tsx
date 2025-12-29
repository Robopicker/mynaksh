import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Message } from '../types/chat';

interface ReplyPreviewProps {
  message: Message;
  onCancel: () => void;
}

export const ReplyPreview: React.FC<ReplyPreviewProps> = memo(({ message, onCancel }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.replyBar} />
        <View style={styles.textContainer}>
          <Text style={styles.label}>Replying to</Text>
          <Text style={styles.messageText} numberOfLines={2}>
            {message.text}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
        <Text style={styles.cancelText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyBar: {
    width: 3,
    height: 40,
    backgroundColor: '#6366f1',
    borderRadius: 2,
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
    maxWidth: '90%',
  },
  label: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  cancelButton: {
    padding: 8,
    marginLeft: 8,
  },
  cancelText: {
    fontSize: 18,
    color: '#999',
  },
});
