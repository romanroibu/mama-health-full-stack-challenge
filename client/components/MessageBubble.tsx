import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { Message } from '../services/ws';

interface MessageBubbleProps {
  message: Message;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { width } = useWindowDimensions();
  const maxBubbleWidth = width * 0.75;
  const isUser = message.role === 'user';

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        paddingHorizontal: 12,
        marginVertical: 4,
      }}
    >
      <View style={{ maxWidth: maxBubbleWidth }}>
        {!isUser && (
          <Text
            style={{
              fontSize: 12,
              color: '#8E8E93',
              marginBottom: 2,
              marginLeft: 4,
            }}
          >
            🐟 Dr. Squiggles
          </Text>
        )}
        <View
          style={{
            backgroundColor: isUser ? '#0B93F6' : '#E8E8E8',
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 18,
            borderCurve: 'continuous',
            // Tail side: remove rounding on the sender's corner
            borderBottomRightRadius: isUser ? 4 : 18,
            borderBottomLeftRadius: isUser ? 18 : 4,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              lineHeight: 22,
              color: isUser ? '#FFFFFF' : '#1A1A1A',
            }}
          >
            {message.content}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 11,
            color: '#8E8E93',
            marginTop: 2,
            alignSelf: isUser ? 'flex-end' : 'flex-start',
            marginHorizontal: 4,
          }}
        >
          {formatTime(message.created_at)}
        </Text>
      </View>
    </View>
  );
};
