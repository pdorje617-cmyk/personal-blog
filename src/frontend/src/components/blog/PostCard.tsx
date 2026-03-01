import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { Post } from "../../backend.d";
import { formatDate } from "../../utils/date";

interface PostCardProps {
  post: Post;
  index: number;
}

export function PostCard({ post, index }: PostCardProps) {
  const excerpt =
    post.body.length > 150
      ? `${post.body.slice(0, 150).trimEnd()}…`
      : post.body;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.07,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <Link
        to="/post/$id"
        params={{ id: post.id.toString() }}
        className="group block no-underline"
      >
        <div className="py-8 border-b border-border">
          {/* Date */}
          <time
            dateTime={new Date(
              Number(post.createdAt / 1_000_000n),
            ).toISOString()}
            className="block text-xs font-sans text-muted-foreground tracking-widest uppercase mb-3"
          >
            {formatDate(post.createdAt)}
          </time>

          {/* Title */}
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-3 leading-tight text-balance group-hover:highlight-accent transition-colors duration-200">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="font-serif text-lg text-muted-foreground leading-relaxed mb-4 max-w-2xl">
            {excerpt}
          </p>

          {/* Tags + read more */}
          <div className="flex items-center gap-3 flex-wrap">
            {post.tags.slice(0, 4).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs font-sans rounded-sm px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
            <span className="ml-auto text-xs font-sans text-muted-foreground group-hover:highlight-accent transition-colors duration-200 flex items-center gap-1">
              Read more →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
