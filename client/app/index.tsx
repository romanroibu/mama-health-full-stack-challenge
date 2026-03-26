import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItemInfo,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatInput } from '../components/ChatInput';
import { MessageBubble } from '../components/MessageBubble';
import { TypingIndicator } from '../components/TypingIndicator';
import { useChat } from '../hooks/useChat';
import { Message } from '../types/chat';

export default function ChatScreen() {
  const { messages, isLoading, isConnected, isBotThinking, sendMessage } = useChat();

  // Inverted FlatList expects data in reverse order (newest first)
  const invertedMessages = [...messages].reverse();

  const renderMessage = useCallback(
    ({ item }: ListRenderItemInfo<Message>) => <MessageBubble message={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  // For an inverted list, ListFooterComponent appears at the top and ListHeaderComponent appears at the bottom.
  // We want typing indicator at the bottom(near the input), so it goes as ListHeaderComponent in an inverted list.
  const listHeader = useCallback(() => {
    if (!isBotThinking) return null;
    return <TypingIndicator />;
  }, [isBotThinking]);

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#0B93F6" />
        <Text style={{ marginTop: 12, color: '#8E8E93', fontSize: 16 }}>
          Loading messages...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E0E0E0',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1A1A' }}>
          🐟 Dr. Squiggles
        </Text>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: isConnected ? '#34C759' : '#FF3B30',
            marginLeft: 8,
          }}
        />
      </View>

      {/* Messages */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <FlatList
          data={invertedMessages}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          inverted
          contentContainerStyle={{
            paddingVertical: 8,
            flexGrow: 1,
          }}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 32,
              }}
            >
              <Text style={{ fontSize: 48, marginBottom: 12 }}>🐟</Text>
              <Text
                style={{
                  fontSize: 16,
                  color: '#8E8E93',
                  textAlign: 'center',
                  lineHeight: 22,
                }}
              >
                Hi there! I&apos;m Dr. Squiggles, your friendly fish doctor.
                {'\n'}Ask me anything about Crohn&apos;s Disease!
              </Text>
            </View>
          }
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        />

        {/* Input */}
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#F8F8F8' }}>
          <ChatInput onSend={sendMessage} disabled={!isConnected} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
