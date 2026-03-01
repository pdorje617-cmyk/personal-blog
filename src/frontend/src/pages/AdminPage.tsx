import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Post } from "../backend.d";
import {
  useCreatePost,
  useDeletePost,
  useGetAllPosts,
  useUpdatePost,
} from "../hooks/useQueries";
import { formatDateShort } from "../utils/date";

const PASSPHRASE = "myblog2024";
const SESSION_KEY = "blog_admin_auth";

// ─── Post Editor Form ─────────────────────────────────────

interface EditorFormProps {
  post?: Post | null;
  onSave: (data: { title: string; body: string; tags: string[] }) => void;
  onCancel: () => void;
  isSaving: boolean;
}

function EditorForm({ post, onSave, onCancel, isSaving }: EditorFormProps) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [tagsRaw, setTagsRaw] = useState(post?.tags.join(", ") ?? "");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({ title: title.trim(), body: body.trim(), tags });
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="post-title" className="text-sm font-sans font-medium">
          Title
        </Label>
        <Input
          ref={titleRef}
          id="post-title"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="font-sans"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="post-body" className="text-sm font-sans font-medium">
          Body
        </Label>
        <Textarea
          id="post-body"
          placeholder="Write your post here…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={14}
          className="font-sans text-sm resize-y"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="post-tags" className="text-sm font-sans font-medium">
          Tags{" "}
          <span className="text-muted-foreground font-normal">
            (comma-separated)
          </span>
        </Label>
        <Input
          id="post-tags"
          placeholder="e.g. thoughts, travel, writing"
          value={tagsRaw}
          onChange={(e) => setTagsRaw(e.target.value)}
          className="font-sans"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSaving} size="sm">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Check className="mr-2 h-3.5 w-3.5" />
              {post ? "Update post" : "Publish post"}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isSaving}
        >
          <X className="mr-2 h-3.5 w-3.5" />
          Cancel
        </Button>
      </div>
    </motion.form>
  );
}

// ─── Admin Panel (authenticated) ─────────────────────────

function AdminPanel() {
  const { data: posts, isLoading } = useGetAllPosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [editingPost, setEditingPost] = useState<Post | null | undefined>(
    undefined,
  );
  // undefined = no editor open, null = new post, Post = editing existing

  async function handleSave(data: {
    title: string;
    body: string;
    tags: string[];
  }) {
    try {
      if (editingPost === null) {
        // Create
        await createPost.mutateAsync(data);
        toast.success("Post published!");
      } else if (editingPost) {
        // Update
        await updatePost.mutateAsync({ id: editingPost.id, ...data });
        toast.success("Post updated!");
      }
      setEditingPost(undefined);
    } catch {
      toast.error("Failed to save post. Please try again.");
    }
  }

  async function handleDelete(post: Post) {
    const confirmed = window.confirm(
      `Delete "${post.title}"? This cannot be undone.`,
    );
    if (!confirmed) return;
    try {
      await deletePost.mutateAsync(post.id);
      toast.success("Post deleted.");
    } catch {
      toast.error("Failed to delete post.");
    }
  }

  const isEditorOpen = editingPost !== undefined;
  const isSaving = createPost.isPending || updatePost.isPending;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Admin Panel
          </h2>
          <p className="text-sm font-sans text-muted-foreground mt-0.5">
            Manage your blog posts
          </p>
        </div>
        {!isEditorOpen && (
          <Button size="sm" onClick={() => setEditingPost(null)}>
            <Plus className="mr-2 h-3.5 w-3.5" />
            New Post
          </Button>
        )}
      </div>

      {/* Editor */}
      <AnimatePresence mode="wait">
        {isEditorOpen && (
          <motion.div
            key="editor"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border border-border rounded-md p-6 bg-card">
              <h3 className="font-display text-lg font-medium mb-5 text-foreground">
                {editingPost ? "Edit post" : "New post"}
              </h3>
              <EditorForm
                post={editingPost}
                onSave={handleSave}
                onCancel={() => setEditingPost(undefined)}
                isSaving={isSaving}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts list */}
      <div>
        <h3 className="font-sans text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          All Posts
        </h3>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-md" />
            ))}
          </div>
        )}

        {!isLoading && posts?.length === 0 && (
          <p className="text-sm font-sans text-muted-foreground py-6 text-center border border-dashed border-border rounded-md">
            No posts yet. Create your first one above.
          </p>
        )}

        {!isLoading && posts && posts.length > 0 && (
          <div className="border border-border rounded-md divide-y divide-border overflow-hidden">
            {posts.map((post, i) => (
              <motion.div
                key={post.id.toString()}
                className="flex items-start gap-4 px-4 py-3.5 bg-card hover:bg-accent/50 transition-colors duration-100"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-medium text-foreground truncate">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs font-sans text-muted-foreground">
                      {formatDateShort(post.createdAt)}
                    </span>
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs px-1.5 py-0 rounded-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setEditingPost(post)}
                    aria-label={`Edit "${post.title}"`}
                    disabled={isEditorOpen}
                  >
                    <Pencil size={13} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(post)}
                    aria-label={`Delete "${post.title}"`}
                    disabled={deletePost.isPending}
                  >
                    {deletePost.isPending ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Passphrase Gate ─────────────────────────────────────

function PassphraseGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value === PASSPHRASE) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onUnlock();
    } else {
      setError(true);
      setValue("");
      setTimeout(() => setError(false), 1200);
    }
  }

  return (
    <motion.div
      className="mx-auto max-w-sm"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <div className="mb-2">
          <span className="text-xs font-sans tracking-widest uppercase text-muted-foreground">
            Restricted
          </span>
        </div>
        <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
          Admin Access
        </h1>
        <p className="font-sans text-sm text-muted-foreground">
          Enter your passphrase to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="passphrase" className="sr-only">
            Passphrase
          </Label>
          <Input
            ref={inputRef}
            id="passphrase"
            type="password"
            placeholder="Passphrase"
            value={value}
            onChange={(e) => {
              setError(false);
              setValue(e.target.value);
            }}
            className={[
              "font-sans text-center text-base",
              error ? "border-destructive focus-visible:ring-destructive" : "",
            ].join(" ")}
            autoComplete="current-password"
          />
          <AnimatePresence>
            {error && (
              <motion.p
                className="text-xs font-sans text-destructive text-center"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                Incorrect passphrase
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <Button type="submit" className="w-full" disabled={!value}>
          Unlock
        </Button>
      </form>
    </motion.div>
  );
}

// ─── Admin Page ───────────────────────────────────────────

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1",
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      {/* Back link */}
      <div className="mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-foreground transition-colors duration-150 group"
        >
          <ArrowLeft
            size={14}
            className="transition-transform duration-150 group-hover:-translate-x-0.5"
          />
          Back to blog
        </Link>
      </div>

      <Separator className="mb-10" />

      {isAuthenticated ? (
        <AdminPanel />
      ) : (
        <PassphraseGate onUnlock={() => setIsAuthenticated(true)} />
      )}
    </main>
  );
}
