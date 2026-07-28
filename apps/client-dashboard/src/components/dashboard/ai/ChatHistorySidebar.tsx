'use client';

import * as React from 'react';
import {
  Button,
  cn,
  ScrollArea,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@gateflow/ui';
import {
  Plus,
  MessageSquare,
  MoreHorizontal,
  FolderIcon,
  ChevronDown,
  Trash2,
  FolderInput,
  Settings,
  Edit2,
  Palette,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ChatSettingsDialog } from './ChatSettingsDialog';

interface ChatHistorySidebarProps {
  isRtl: boolean;
  onNewChat: () => void;
}

export function ChatHistorySidebar({
  isRtl,
  onNewChat,
}: ChatHistorySidebarProps) {
  const { t } = useTranslation('dashboard');
  const [expandedFolders, setExpandedFolders] = React.useState<
    Record<string, boolean>
  >({ important: true });
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [activeSettingsChat, setActiveSettingsChat] = React.useState('');

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openSettings = (chatTitle: string) => {
    setActiveSettingsChat(chatTitle);
    setSettingsOpen(true);
  };

  return (
    <div
      className={cn(
        'flex h-full flex-col w-64 bg-[var(--ds-background-neutral-subtle)] bg-background shrink-0',
        isRtl
          ? 'border-l border-border border-border'
          : 'border-r border-border border-border'
      )}
    >
      {/* Search & New Chat */}
      <div className="p-4 flex flex-col gap-3">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2 bg-background hover:bg-[var(--ds-background-neutral-subtle-hovered)] hover:bg-accent text-foreground border border-border border-border shadow-sm px-3"
          variant="outline"
          size="sm"
        >
          <Plus size={16} />
          <span className="font-semibold">{t('ai.newChat', 'New Chat')}</span>
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="flex flex-col gap-6 py-2">
          {/* Folders Section */}
          <div className="flex flex-col gap-1">
            <div className="px-2 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-[var(--ds-text-subtlest)]">
              <span>{t('ai.folders', 'Folders')}</span>
              <Button variant="ghost" size="icon" className="h-4 w-4">
                <Plus size={12} />
              </Button>
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between group px-2 py-1 flex-1">
                <button
                  onClick={() => toggleFolder('important')}
                  className="flex items-center gap-2 flex-1 text-sm text-[var(--ds-text-subtle)] hover:text-[var(--ds-text)] rounded-[3px] transition-colors"
                >
                  <div
                    className={cn(
                      'transition-transform',
                      expandedFolders['important'] && 'rotate-0',
                      !expandedFolders['important'] &&
                        (isRtl ? 'rotate-90' : '-rotate-90')
                    )}
                  >
                    <ChevronDown size={14} />
                  </div>
                  <FolderIcon
                    size={14}
                    className="text-[var(--ds-text-warning)] fill-current fill-opacity-10"
                  />
                  <span className="flex-1 text-left truncate">
                    {t('ai.folderImportant', 'Important')}
                  </span>
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align={isRtl ? 'start' : 'end'}
                    className="w-40 z-50"
                  >
                    <DropdownMenuItem className="gap-2 text-xs">
                      <Edit2 size={12} /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-xs">
                      <Palette size={12} /> Change Color
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-xs text-destructive focus:text-destructive">
                      <Trash2 size={12} /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {expandedFolders['important'] && (
                <div
                  className={cn(
                    'flex flex-col gap-0.5 py-0.5',
                    isRtl ? 'mr-6 border-r pr-2' : 'ml-6 border-l pl-2',
                    'border-border border-border'
                  )}
                >
                  <button className="px-2 py-1.5 text-xs text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle-hovered)] rounded-[3px] truncate text-left">
                    Quarterly Scan Report
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* History Sections */}
          <div className="flex flex-col gap-1">
            <h3 className="px-2 py-1 text-[11px] font-bold uppercase tracking-widest text-[var(--ds-text-subtlest)]">
              {t('ai.today', 'Today')}
            </h3>
            <div className="flex flex-col gap-0.5">
              <ChatItem
                active
                title="How to generate QR codes?"
                _isRtl={isRtl}
                onOpenSettings={() => openSettings('How to generate QR codes?')}
              />
              <ChatItem
                title="Visitor analytics for Sector 7"
                _isRtl={isRtl}
                onOpenSettings={() =>
                  openSettings('Visitor analytics for Sector 7')
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="px-2 py-1 text-[11px] font-bold uppercase tracking-widest text-[var(--ds-text-subtlest)]">
              {t('ai.yesterday', 'Yesterday')}
            </h3>
            <div className="flex flex-col gap-0.5">
              <ChatItem
                title="Security incident 102 log"
                _isRtl={isRtl}
                onOpenSettings={() => openSettings('Security incident 102 log')}
              />
              <ChatItem
                title="Bulk gate assignments help"
                _isRtl={isRtl}
                onOpenSettings={() =>
                  openSettings('Bulk gate assignments help')
                }
              />
            </div>
          </div>
        </div>
      </ScrollArea>

      <ChatSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        chatTitle={activeSettingsChat}
      />
    </div>
  );
}

function ChatItem({
  title,
  active = false,
  _isRtl,
  onOpenSettings,
}: {
  title: string;
  active?: boolean;
  _isRtl: boolean;
  onOpenSettings: () => void;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors group rounded-[3px] relative',
        active
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-muted-foreground hover:bg-[var(--ds-background-neutral-subtle-hovered)] hover:bg-accent'
      )}
    >
      <MessageSquare
        size={14}
        className={active ? 'text-primary' : 'text-muted-foreground'}
      />
      <span className="flex-1 text-left truncate cursor-pointer">{title}</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 opacity-0 group-hover:opacity-100 absolute right-2 bg-inherit hover:bg-[var(--ds-background-neutral-hovered)]"
          >
            <MoreHorizontal size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 z-50">
          <DropdownMenuItem
            className="gap-2 text-xs cursor-pointer"
            onClick={onOpenSettings}
          >
            <Settings size={12} />{' '}
            {active ? 'Chat Settings (Rules)' : 'Settings'}
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 text-xs">
            <FolderInput size={12} /> Move to Folder
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-xs text-destructive focus:text-destructive">
            <Trash2 size={12} /> Delete Chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
