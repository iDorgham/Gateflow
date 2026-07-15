'use client';

import { useState, useEffect, use } from 'react';
import {
  Plus,
  Search,
  FileText,
  MoreVertical,
  Globe,
  Calendar,
  Eye,
  Trash2,
  Edit3,
  Loader2,
  Sparkles,
} from 'lucide-react';
import {
  Button,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Badge,
} from '@gateflow/ui';
import { toast } from 'sonner';
import { BlogEditor } from '@/components/cms/BlogEditor';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlogStudioPage(props: {
  params: Promise<{ locale: string; orgId: string }>;
}) {
  const params = use(props.params);
  const { locale, orgId } = params;

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [orgId]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/cms/blog?orgId=${orgId}&locale=${locale}`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      toast.error('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/cms/blog/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Post deleted');
        fetchPosts();
      }
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  if (editingPost || isCreating) {
    return <BlogEditor postId={editingPost?.id} />;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-blue-600" />
            Blog Studio
          </h1>
          <p className="text-ds-text-subtle">
            Manage your AI-powered multi-lingual content engine.
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-6 h-auto font-bold uppercase tracking-widest text-xs"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Post
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ds-text-subtle" />
        <Input
          placeholder="Search articles, topics, or authors..."
          className="pl-12 py-6 bg-white border-ds-border/40 rounded-2xl shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-ds-text-subtle font-medium animate-pulse uppercase tracking-widest text-xs">
            Optimizing Content Feed...
          </p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-ds-border/40 rounded-3xl bg-ds-background-neutral-subtle/30 space-y-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-ds-border/40">
            <FileText className="w-8 h-8 text-ds-text-subtle" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg">No posts yet</h3>
            <p className="text-ds-text-subtle max-w-xs mx-auto">
              Start by creating your first AI-assisted blog post to reach your
              audience in EN & AR.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsCreating(true)}
            className="rounded-xl border-ds-border/60"
          >
            Initialize Studio
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-white rounded-3xl border border-ds-border/40 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="aspect-[16/9] bg-ds-background-neutral-subtle relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge
                      className={
                        post.status === 'PUBLISHED'
                          ? 'bg-green-500 text-white border-0'
                          : 'bg-yellow-500 text-white border-0'
                      }
                    >
                      {post.status}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold opacity-80">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-black text-xl line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-ds-text-subtle text-sm line-clamp-2 leading-relaxed">
                    {post.excerpt || 'No excerpt provided.'}
                  </p>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-ds-border/10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {post.author?.name?.[0] || 'A'}
                      </div>
                      <span className="text-xs font-bold text-ds-text-subtle uppercase tracking-wider">
                        {post.author?.name || 'Admin'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setEditingPost(post)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-2xl p-2 shadow-2xl border-ds-border/40"
                        >
                          <DropdownMenuItem className="rounded-xl gap-2 font-medium">
                            <Eye className="w-4 h-4" /> View in Hub
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl gap-2 font-medium">
                            <Globe className="w-4 h-4" /> Preview AR
                          </DropdownMenuItem>
                          <div className="h-px bg-ds-border/10 my-1" />
                          <DropdownMenuItem
                            className="rounded-xl gap-2 font-medium text-red-600 focus:text-red-600 focus:bg-red-50"
                            onClick={() => deletePost(post.slug)}
                          >
                            <Trash2 className="w-4 h-4" /> Delete Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
