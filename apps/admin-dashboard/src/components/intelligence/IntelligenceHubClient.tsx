'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  BrainCircuit,
  Database,
  MessageSquare,
  Plus,
  Upload,
  Globe,
  RefreshCw,
  CheckCircle2,
  Clock,
  Zap,
  Search,
  Bot,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ScrollArea,
  Separator,
  cn,
} from '@gateflow/ui';

interface KnowledgeSource {
  id: string;
  name: string;
  type: 'WEBSITE' | 'PDF' | 'DOCX' | 'TXT' | 'INTERNAL_PAGE' | 'DATABASE_TABLE';
  status: 'PENDING' | 'INDEXING' | 'SYNCED' | 'FAILED';
  lastSyncedAt: string | null;
}

interface IntelligenceHubProps {
  orgId: string;
  initialSources: KnowledgeSource[];
}

export function IntelligenceHubClient({
  orgId,
  initialSources,
}: IntelligenceHubProps) {
  const [sources, setSources] = useState(initialSources);
  const [query, setQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([]);
  const [isChatting, setIsChatting] = useState(false);

  const handleSync = async (sourceId: string) => {
    setIsSyncing(sourceId);
    try {
      await fetch('/api/intelligence/sync', {
        method: 'POST',
        body: JSON.stringify({ sourceId, orgId }),
      });
      // Update local state to SYNCED
      setSources((prev) =>
        prev.map((s) =>
          s.id === sourceId
            ? { ...s, status: 'SYNCED', lastSyncedAt: new Date().toISOString() }
            : s
        )
      );
    } finally {
      setIsSyncing(null);
    }
  };

  const handleChat = async () => {
    if (!query) return;
    const userMsg = query;
    setQuery('');
    setChatHistory((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsChatting(true);

    try {
      const res = await fetch('/api/intelligence/chat', {
        method: 'POST',
        body: JSON.stringify({ query: userMsg, orgId }),
      });
      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', content: data.response },
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
            <BrainCircuit className="w-6 h-6 text-indigo-500" />
            Intelligence Hub
          </h2>
          <p className="text-sm text-ds-text-subtle">
            Train your organization&apos;s AI assistant with private knowledge
            and operational docs.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 gap-2">
          <Plus className="w-4 h-4" />
          Add Knowledge Source
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Sources & Indexing */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-ds-border/40 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-ds-text-subtle flex items-center gap-2">
                <Database className="w-4 h-4" />
                Knowledge Sources
              </CardTitle>
              <Badge variant="outline" className="text-[9px] font-black">
                {sources.length} Indexed
              </Badge>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {sources.map((source) => (
                  <div
                    key={source.id}
                    className="p-4 rounded-xl border border-ds-border/40 bg-slate-50/30 flex items-center justify-between hover:border-indigo-500/20 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-lg bg-white shadow-sm border border-ds-border/40">
                        {source.type === 'WEBSITE' ? (
                          <Globe className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Upload className="w-4 h-4 text-indigo-500" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{source.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={cn(
                              'text-[8px] font-black uppercase tracking-widest px-1.5 py-0',
                              source.status === 'SYNCED'
                                ? 'bg-green-500/10 text-green-600 border-green-500/20'
                                : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                            )}
                          >
                            {source.status}
                          </Badge>
                          <span className="text-[10px] text-ds-text-subtle flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {source.lastSyncedAt
                              ? new Date(
                                  source.lastSyncedAt
                                ).toLocaleDateString()
                              : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => handleSync(source.id)}
                      disabled={isSyncing === source.id}
                    >
                      <RefreshCw
                        className={cn(
                          'w-4 h-4',
                          isSyncing === source.id && 'animate-spin'
                        )}
                      />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full border-dashed border-2 py-8 rounded-2xl gap-2 hover:bg-slate-50"
                >
                  <Plus className="w-4 h-4 text-indigo-500" />
                  Connect New Integration
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-ds-border/40 bg-indigo-600 text-white shadow-xl shadow-indigo-500/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Zap className="w-5 h-5 text-yellow-300" />
                </div>
                <h4 className="font-black uppercase tracking-tight text-sm italic">
                  Intelligence Core v1.0
                </h4>
              </div>
              <p className="text-xs text-indigo-100 leading-relaxed">
                All knowledge is stored as high-dimensional vector embeddings,
                enabling semantic search that understands the **context** of
                your operational rules, not just keywords.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Assistant Chat */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="border-ds-border/40 shadow-xl overflow-hidden flex flex-col flex-1 min-h-[600px] bg-white">
            <CardHeader className="bg-slate-50 border-b border-ds-border/40 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-black uppercase tracking-tight italic">
                      Vertical Assistant
                    </CardTitle>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-[10px] text-ds-text-subtle font-bold uppercase tracking-widest">
                        Grounding Active
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-[10px] font-black uppercase tracking-widest text-ds-text-subtle"
                >
                  Clear History
                </Button>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {chatHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-4">
                    <div className="p-4 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-400">
                      <MessageSquare className="w-10 h-10" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">
                        Ready to assist
                      </h4>
                      <p className="text-sm text-ds-text-subtle max-w-xs mx-auto">
                        Ask questions about your organization&apos;s rules,
                        policies, or complex-specific procedures.
                      </p>
                    </div>
                  </div>
                ) : (
                  chatHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex gap-4',
                        msg.role === 'user' ? 'flex-row-reverse' : ''
                      )}
                    >
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg shrink-0 flex items-center justify-center',
                          msg.role === 'user'
                            ? 'bg-slate-200 text-slate-600'
                            : 'bg-indigo-100 text-indigo-600'
                        )}
                      >
                        {msg.role === 'user' ? (
                          <Search className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      <div
                        className={cn(
                          'p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed',
                          msg.role === 'user'
                            ? 'bg-slate-900 text-white rounded-tr-none'
                            : 'bg-slate-100 text-slate-800 rounded-tl-none border border-ds-border/40'
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
                {isChatting && (
                  <div className="flex gap-4 animate-pulse">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-100 border border-ds-border/40 text-ds-text-subtle text-xs italic">
                      Consulting knowledge base...
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-6 bg-slate-50 border-t border-ds-border/40">
              <div className="relative">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                  placeholder="e.g., 'What are the rules for visitor parking in Sector 5?'"
                  className="h-14 pr-16 rounded-2xl border-ds-border/40 shadow-sm focus:ring-indigo-500/20 bg-white"
                />
                <Button
                  className="absolute right-2 top-2 h-10 w-10 bg-indigo-600 hover:bg-indigo-700 rounded-xl p-0"
                  onClick={handleChat}
                  disabled={isChatting || !query}
                >
                  <ArrowRight className="w-5 h-5 text-white" />
                </Button>
              </div>
              <div className="mt-3 flex items-center justify-center gap-4">
                <span className="text-[10px] text-ds-text-subtle font-black uppercase tracking-widest">
                  Suggested Queries:
                </span>
                <button
                  onClick={() => setQuery('Visitor access policy')}
                  className="text-[10px] text-indigo-600 hover:underline font-bold underline-offset-2"
                >
                  Visitor Policy
                </button>
                <button
                  onClick={() => setQuery('Emergency contacts')}
                  className="text-[10px] text-indigo-600 hover:underline font-bold underline-offset-2"
                >
                  Emergency Hub
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14m-7-7 7 7-7 7" />
    </svg>
  );
}
