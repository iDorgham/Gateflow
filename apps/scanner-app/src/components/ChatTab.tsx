import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { getValidAccessToken } from '../lib/auth-client';
import { nativeTokensNewEra as nativeTokens } from '../../../../packages/ui/src/tokens';

const TOP_OFFSET =
  Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 20 : 60;

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

// Time formatting
function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return (
    date.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
    ' ' +
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
}

// Message bubble
function MessageBubble({ item }: { item: ChatMessage }) {
  return (
    <View
      style={[
        s.messageContainer,
        item.isOwn ? s.ownContainer : s.otherContainer,
      ]}
    >
      {!item.isOwn && (
        <View style={s.avatar}>
          <Text style={s.avatarText}>
            {item.senderName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </Text>
        </View>
      )}
      <View style={[s.messageBubble, item.isOwn ? s.ownBubble : s.otherBubble]}>
        {!item.isOwn && <Text style={s.senderName}>{item.senderName}</Text>}
        <Text style={[s.messageText, item.isOwn ? s.ownText : s.otherText]}>
          {item.content}
        </Text>
        <Text
          style={[s.timestamp, item.isOwn ? s.ownTimestamp : s.otherTimestamp]}
        >
          {formatMessageTime(item.timestamp)}
        </Text>
      </View>
    </View>
  );
}

// Empty state
function EmptyState() {
  return (
    <View style={s.center}>
      <Text style={s.emptyIcon}>💬</Text>
      <Text style={s.emptyTitle}>No messages yet</Text>
      <Text style={s.emptySub}>
        Start a conversation with your team. Messages are synced when you are
        online.
      </Text>
    </View>
  );
}

// Main component
export function ChatTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const loadMessages = useCallback(async () => {
    try {
      const token = await getValidAccessToken();
      if (!token) {
        setMessages([]);
        return;
      }

      const apiBase =
        process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';
      const res = await fetch(`${apiBase}/chat/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(data.data || []);
      } else {
        setMessages([]);
      }
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || sending) return;

    setSending(true);
    setInputText('');

    try {
      const token = await getValidAccessToken();
      if (!token) return;

      const apiBase =
        process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';
      const res = await fetch(`${apiBase}/chat/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: text }),
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages((prev) => [...prev, newMessage.data]);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch {
      // Silent fail - message not sent
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Chat</Text>
        <Text style={s.subtitle}>
          {messages.length > 0
            ? `${messages.length} messages`
            : 'Team communication'}
        </Text>
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={nativeTokens.colors.primary} />
        </View>
      ) : messages.length === 0 ? (
        <View style={s.content}>
          <EmptyState />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: false });
          }}
          renderItem={({ item }) => <MessageBubble item={item} />}
        />
      )}

      {/* Input area */}
      <View style={s.inputContainer}>
        <TextInput
          style={s.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={nativeTokens.colors.textSubtlest}
          multiline
          maxLength={1000}
          editable={!sending}
        />
        <Pressable
          style={[
            s.sendButton,
            (!inputText.trim() || sending) && s.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator
              size="small"
              color={nativeTokens.colors.textInverse}
            />
          ) : (
            <Text style={s.sendButtonText}>Send</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

// Styles
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: nativeTokens.colors.background,
    paddingTop: TOP_OFFSET,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: nativeTokens.colors.border,
  },
  title: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 24,
    color: nativeTokens.colors.textHeading,
  },
  subtitle: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 13,
    color: nativeTokens.colors.textSubtle,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  content: {
    flex: 1,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 18,
    color: nativeTokens.colors.textHeading,
    textAlign: 'center',
  },
  emptySub: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 14,
    color: nativeTokens.colors.textSubtle,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
  listContent: {
    paddingBottom: 24,
    paddingTop: 16,
    paddingHorizontal: 16,
  },

  // Message bubble
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  ownContainer: {
    alignSelf: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: nativeTokens.colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
  },
  avatarText: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 12,
    color: nativeTokens.colors.textPrimary,
  },
  messageBubble: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    maxWidth: '100%',
  },
  ownBubble: {
    backgroundColor: nativeTokens.colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: nativeTokens.colors.surfaceSubtle,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
  },
  senderName: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 12,
    color: nativeTokens.colors.textHeading,
    marginBottom: 4,
  },
  messageText: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 16,
    lineHeight: 22,
  },
  ownText: {
    color: nativeTokens.colors.textInverse,
  },
  otherText: {
    color: nativeTokens.colors.textPrimary,
  },
  timestamp: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 10,
    marginTop: 6,
  },
  ownTimestamp: {
    color: nativeTokens.colors.textSubtle,
    textAlign: 'right',
  },
  otherTimestamp: {
    color: nativeTokens.colors.textSubtlest,
  },

  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderColor: nativeTokens.colors.border,
    backgroundColor: nativeTokens.colors.surfaceSubtle,
  },
  input: {
    flex: 1,
    backgroundColor: nativeTokens.colors.background,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontFamily: 'Cairo_400Regular',
    fontSize: 16,
    color: nativeTokens.colors.textPrimary,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
  },
  sendButton: {
    backgroundColor: nativeTokens.colors.primary,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.textInverse,
    fontSize: 15,
  },
});
