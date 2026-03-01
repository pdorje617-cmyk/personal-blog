import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";
import { motion } from "motion/react";
import { PostCard } from "../components/blog/PostCard";
import { useGetAllPosts } from "../hooks/useQueries";

export function HomePage() {
  const { data: posts, isLoading, isError } = useGetAllPosts();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {/* Hero header */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="mb-2">
          <span className="text-xs font-sans tracking-widest uppercase text-muted-foreground">
            A personal space
          </span>
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-semibold text-foreground leading-tight mb-4">
          My Blog
        </h1>
        <p className="font-serif text-xl text-muted-foreground max-w-xl leading-relaxed">
          Thoughts, ideas, and explorations — written for curious minds.
        </p>
        {/* Decorative rule */}
        <div className="mt-8 flex items-center gap-4">
          <div className="h-px w-12 bg-highlight opacity-70" />
          <div className="h-px flex-1 bg-border" />
        </div>
      </motion.div>

      {/* Post list */}
      {isLoading && (
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-8 border-b border-border">
              <Skeleton className="h-3 w-32 mb-3" />
              <Skeleton className="h-8 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="py-12 text-center">
          <p className="font-sans text-destructive text-sm">
            Failed to load posts. Please refresh the page.
          </p>
        </div>
      )}

      {!isLoading && !isError && posts && posts.length === 0 && (
        <motion.div
          className="py-24 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FileText
            size={32}
            strokeWidth={1}
            className="mx-auto mb-4 text-muted-foreground opacity-50"
          />
          <p className="font-display text-xl text-muted-foreground mb-2">
            Nothing here yet
          </p>
          <p className="font-sans text-sm text-muted-foreground">
            The first post is just around the corner.
          </p>
        </motion.div>
      )}

      {!isLoading && !isError && posts && posts.length > 0 && (
        <section aria-label="Blog posts">
          {posts.map((post, i) => (
            <PostCard key={post.id.toString()} post={post} index={i} />
          ))}
        </section>
      )}
    </main>
  );
}
