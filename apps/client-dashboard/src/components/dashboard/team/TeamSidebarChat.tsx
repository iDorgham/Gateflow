'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { 
  Send, 
  X, 
  MessageSquare, 
  Users, 
  RefreshCw,
  Loader2
} from 'lucide-react';
import { 
  Button, 
  Input, 
  ScrollArea, 
  Avatar, 
  AvatarFallback, 
  AvatarImage,
  cn 
} from '@gate-access/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
    email: string;
  };
}

interface Member {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: { name: string };
}

interface TeamSidebarChatProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  currentUserId: string;
}

export function TeamSidebarChat({ isOpen, onClose, locale, currentUserId }: TeamSidebarChatProps) {
  const { t } = useTranslation('dashboard');
  const queryClient = useQueryClient();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading: loadingMessages, refetch: refetchMessages } = useQuery<Message[]>({
    queryKey: ['team-messages'],
    queryFn: async () => {
      const res = await fetch('/api/team/messages');
      const json = await res.json();
      return json.data || [];
    },
    enabled: isOpen,
  });

  const { data: members = [] } = useQuery<Member[]>({
    queryKey: ['team-members'],
    queryFn: async () => {
      const res = await fetch('/api/team/members');
      const json = await res.json();
      return json.data || [];
    },
    enabled: isOpen,
  });

  const sendMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch('/api/team/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      });
      return res.json();
    },
    onSuccess: () => {
      setInputText('');
      queryClient.invalidateQueries({ queryKey: ['team-messages'] });
    },
  });

  const handleSend = () => {
    if (!inputText.trim() || sendMutation.isPending) return;
    sendMutation.mutate(inputText);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const isRtl = locale === 'ar-EG' || locale === 'ar-SA';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          />

          <motion.aside
            initial={{ x: isRtl ? -400 : 400 }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? -400 : 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed inset-y-0 z-50 flex w-full flex-col border-[var(--ds-border)] bg-[var(--ds-surface-sunken)] shadow-2xl lg:w-[380px]",
              isRtl ? "left-0 border-r" : "right-0 border-l"
            )}
            style={{ backgroundColor: '#18191a' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--ds-border)] px-4 py-3" style={{ backgroundColor: '#1f1f21' }}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--ds-background-brand-bold)] text-white">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--ds-text-inverse)]">
                    {t('team.chat.title', 'Team Chat')}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-[var(--ds-text-subtle)]">
                    <Users className="h-3 w-3" />
                    <span>{members.length} {t('team.chat.members', 'members')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-[var(--ds-text-subtle)] hover:bg-white/10"
                  onClick={() => refetchMessages()}
                  disabled={loadingMessages}
                >
                  <RefreshCw className={cn("h-4 w-4", loadingMessages && "animate-spin")} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-[var(--ds-text-subtle)] hover:bg-white/10"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="flex flex-col gap-4">
                {loadingMessages ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[var(--ds-text-brand)]" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="mb-3 rounded-full bg-white/5 p-4">
                      <MessageSquare className="h-8 w-8 text-[var(--ds-text-subtle)]" />
                    </div>
                    <p className="text-sm font-medium text-[var(--ds-text-subtle)]">
                      {t('team.chat.noMessages', 'No messages yet.')}
                    </p>
                    <p className="max-w-[200px] text-xs text-[var(--ds-text-subtlest)]">
                      {t('team.chat.startConversation', 'Start a conversation with your security team.')}
                    </p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isOwn = msg.user.id === currentUserId;
                    const showAvatar = i === 0 || messages[i-1].user.id !== msg.user.id;
                    
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        key={msg.id} 
                        className={cn(
                          "flex items-end gap-2",
                          isOwn ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        <div className="w-8 shrink-0">
                          {showAvatar && !isOwn && (
                            <Avatar className="h-8 w-8">
                              {msg.user.avatarUrl && <AvatarImage src={msg.user.avatarUrl} />}
                              <AvatarFallback className="bg-white/10 text-[10px] text-white">
                                {msg.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        <div className={cn(
                          "flex max-w-[80%] flex-col gap-1",
                          isOwn ? "items-end" : "items-start"
                        )}>
                          {showAvatar && !isOwn && (
                            <span className="px-1 text-[10px] font-bold text-[var(--ds-text-subtlest)]">
                              {msg.user.name}
                            </span>
                          )}
                          <div 
                            className={cn(
                              "rounded-2xl px-3 py-2 text-sm",
                              isOwn 
                                ? "bg-[var(--ds-background-brand-bold)] text-white rounded-br-none shadow-sm" 
                                : "bg-[#1f1f21] text-[var(--ds-text-inverse)] rounded-bl-none border border-white/5 shadow-sm"
                            )}
                          >
                            {msg.content}
                          </div>
                          <span className="px-1 text-[9px] text-[var(--ds-text-subtlest)] opacity-50">
                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-[var(--ds-border)] p-4" style={{ backgroundColor: '#1f1f21' }}>
              <div className="flex items-center gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder={t('team.chat.placeholder', 'Type a message...')}
                  className="bg-black/20 border-white/10 text-white placeholder:text-white/30 focus:ring-[var(--ds-border-brand)]"
                />
                <Button 
                  size="icon" 
                  disabled={!inputText.trim() || sendMutation.isPending}
                  onClick={handleSend}
                  className="shrink-0 bg-[var(--ds-background-brand-bold)] hover:bg-[var(--ds-background-brand-bold-hovered)]"
                >
                  {sendMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
