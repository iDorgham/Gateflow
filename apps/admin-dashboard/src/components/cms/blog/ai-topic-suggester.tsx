import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@gateflow/ui';
import { Sparkles, Lightbulb, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export interface TopicSuggestion {
  title: string;
  excerpt: string;
  keywords: string[];
}

interface AITopicSuggesterProps {
  onSelect: (topic: TopicSuggestion) => void;
}

export function AITopicSuggester({ onSelect }: AITopicSuggesterProps) {
  const [suggestions, setSuggestions] = useState<TopicSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const generateTopics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cms/blog/suggest-topics', {
        method: 'POST',
      });
      const data = await response.json();
      setSuggestions(data.topics);
      setIsOpen(true);
    } catch (error) {
      toast.error('Failed to generate topic suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={generateTopics}
        disabled={isLoading}
        className="gap-2 text-ds-text-brand border-ds-border hover:bg-ds-background-brand-subtle"
      >
        <Sparkles className="h-4 w-4" />
        {isLoading ? 'Thinking...' : 'AI Topic Suggestion'}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] border-ds-border bg-ds-surface shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-ds-background-brand-subtle rounded-lg">
                <Lightbulb className="h-5 w-5 text-ds-text-brand" />
              </div>
              <DialogTitle className="text-xl font-black uppercase tracking-tighter">
                AI Content Strategy
              </DialogTitle>
            </div>
            <DialogDescription>
              We&apos;ve analyzed current trends in PropTech and security to
              suggest these high-impact topics for your blog.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {suggestions.map((topic, index) => (
              <Card
                key={index}
                className="group cursor-pointer hover:border-ds-border-brand border-2 transition-all shadow-sm hover:shadow-md bg-ds-surface"
                onClick={() => {
                  onSelect(topic);
                  setIsOpen(false);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-ds-text group-hover:text-ds-text-brand transition-colors uppercase tracking-tight">
                      {topic.title}
                    </h4>
                    <TrendingUp className="h-4 w-4 text-ds-icon-success opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-ds-text-subtle mb-4 line-clamp-2 italic">
                    &quot;{topic.excerpt}&quot;
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {topic.keywords.map((kw) => (
                      <Badge
                        key={kw}
                        variant="outline"
                        className="text-[10px] font-bold uppercase py-0 border-ds-border group-hover:border-ds-border-brand/30"
                      >
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={generateTopics}
              disabled={isLoading}
              className="text-xs font-bold text-ds-text-subtle"
            >
              <Sparkles className="h-3 w-3 mr-2" /> Refresh Suggestions
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
