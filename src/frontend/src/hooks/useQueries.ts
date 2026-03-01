import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Post } from "../backend.d";
import { useActor } from "./useActor";

// ─── Queries ──────────────────────────────────────────────

export function useGetAllPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!actor) return [];
      const posts = await actor.getAllPosts();
      return [...posts].sort((a, b) => Number(b.createdAt - a.createdAt));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPost(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Post | null>({
    queryKey: ["post", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getPost(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

// ─── Mutations ────────────────────────────────────────────

export function useCreatePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      body,
      tags,
    }: {
      title: string;
      body: string;
      tags: string[];
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createPost(title, body, tags);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export function useUpdatePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      body,
      tags,
    }: {
      id: bigint;
      title: string;
      body: string;
      tags: string[];
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updatePost(id, title, body, tags);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deletePost(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}
