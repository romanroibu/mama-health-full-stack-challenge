import React, { useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false }) => {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const canSend = text.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    const message = text.trim();

    // Clearing first prevents iOS multiline TextInput from restoring stale text.
    setText('');
    inputRef.current?.clear();

    onSend(message);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#F8F8F8',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
      }}
    >
      <TextInput
        ref={inputRef}
        style={{
          flex: 1,
          minHeight: 40,
          maxHeight: 120,
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          borderCurve: 'continuous',
          paddingHorizontal: 16,
          paddingVertical: 10,
          fontSize: 16,
          color: '#1A1A1A',
          borderWidth: 1,
          borderColor: '#E0E0E0',
        }}
        placeholder="Type a message..."
        placeholderTextColor="#8E8E93"
        value={text}
        onChangeText={setText}
        multiline
        textAlignVertical="top"
        editable={!disabled}
      />
      <TouchableOpacity
        onPress={handleSend}
        disabled={!canSend}
        activeOpacity={0.7}
        style={{
          marginLeft: 8,
          width: 40,
          height: 40,
          borderRadius: 20,
          borderCurve: 'continuous',
          backgroundColor: canSend ? '#0B93F6' : '#B0B0B0',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600' }}>
          ↑
        </Text>
      </TouchableOpacity>
    </View>
  );
};
