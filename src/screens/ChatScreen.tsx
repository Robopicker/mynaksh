import React, { useRef, useState, useCallback, useMemo } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useChatContext } from '../context/ChatContext';
import { MessageBubble } from '../components/MessageBubble';
import { ReplyPreview } from '../components/ReplyPreview';
import { EndChatOverlay } from '../components/EndChatOverlay';
import { Message } from '../types/chat';

export const ChatScreen: React.FC = () => {
  const { messages, replyingTo, showEndChatOverlay, setReplyingTo, setShowEndChatOverlay, sendMessage } =
    useChatContext();
  const flatListRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState('');

  const getReplyToMessage = useCallback(
    (replyToId?: string): Message | undefined => {
      if (!replyToId) return undefined;
      return messages.find((m) => m.id === replyToId);
    },
    [messages]
  );

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => {
      const replyToMessage = getReplyToMessage(item.replyTo);
      return <MessageBubble message={item} replyToMessage={replyToMessage} />;
    },
    [getReplyToMessage]
  );

  const handleSend = useCallback(() => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  }, [inputText, sendMessage]);

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
  }, [setReplyingTo]);

  const handleShowEndChat = useCallback(() => {
    setShowEndChatOverlay(true);
  }, [setShowEndChatOverlay]);

  const handleContentSizeChange = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const sendButtonStyle = useMemo(
    () => [styles.sendButton, !inputText.trim() && styles.sendButtonDisabled],
    [inputText]
  );

  const isSendDisabled = useMemo(() => !inputText.trim(), [inputText]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Astrologer</Text>
            <Text style={styles.headerSubtitle}>Online</Text>
          </View>
          <TouchableOpacity
            onPress={handleShowEndChat}
            style={styles.endChatButton}>
            <Text style={styles.endChatText}>End Chat</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={handleContentSizeChange}
          />

          {replyingTo && (
            <ReplyPreview message={replyingTo} onCancel={handleCancelReply} />
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              multiline
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              style={sendButtonStyle}
              onPress={handleSend}
              disabled={isSendDisabled}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {showEndChatOverlay && <EndChatOverlay />}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#4ade80',
    marginTop: 2,
  },
  endChatButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  endChatText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  keyboardView: {
    flex: 1,
  },
  messageList: {
    paddingVertical: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
