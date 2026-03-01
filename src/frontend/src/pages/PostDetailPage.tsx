import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useGetPost } from "../hooks/useQueries";
import { formatDate } from "../utils/date";

export function PostDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const postId = id ? BigInt(id) : null;
  const { data: post, isLoading, isError } = useGetPost(postId);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Skeleton className="h-4 w-24 mb-10" />
        <Skeleton className="h-3 w-32 mb-4" />
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-10 w-1/2 mb-8" />
        <div className="space-y-3 mt-10">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
          <Skeleton className="h-5 w-2/3" />
        </div>
      </main>
    );
  }

  if (isError || !post) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-foreground transition-colors duration-150 mb-10"
        >
          <ArrowLeft size={14} />
          Back to posts
        </Link>
        <div className="py-16 text-center">
          <p className="font-display text-2xl text-muted-foreground mb-2">
            Post not found
          </p>
          <p className="font-sans text-sm text-muted-foreground">
            This post may have been removed or the link is invalid.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-foreground transition-colors duration-150 mb-10 group"
        >
          <ArrowLeft
            size={14}
            className="transition-transform duration-150 group-hover:-translate-x-0.5"
          />
          Back to posts
        </Link>
      </motion.div>

      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Date */}
        <time
          dateTime={new Date(Number(post.createdAt / 1_000_000n)).toISOString()}
          className="block text-xs font-sans text-muted-foreground tracking-widest uppercase mb-4"
        >
          {formatDate(post.createdAt)}
        </time>

        {/* Title */}
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground leading-tight mb-6 text-balance">
          {post.title}
        </h1>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs font-sans rounded-sm px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Decorative divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px w-10 bg-highlight opacity-70" />
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Body */}
        <div className="prose-blog whitespace-pre-wrap">{post.body}</div>

        {/* Updated note */}
        {post.updatedAt !== post.createdAt && (
          <p className="mt-12 text-xs font-sans text-muted-foreground border-t border-border pt-4">
            Last updated: {formatDate(post.updatedAt)}
          </p>
        )}
      </motion.article>
    </main>
  );
}
