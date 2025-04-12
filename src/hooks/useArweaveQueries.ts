import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserProfile,
  createUserProfile,
  getFeedPosts,
  getUserPosts,
  createBlogPost,
  getPost,
  UserProfile,
  BlogPost,
} from "../lib/arweave";
import { toast } from "sonner";

// Query keys
export const queryKeys = {
  profile: (address: string) => ["profile", address] as const,
  feedPosts: ["feedPosts"] as const,
  userPosts: (address: string) => ["userPosts", address] as const,
  post: (id: string) => ["post", id] as const,
};

// Hook to get user profile
export function useUserProfileQuery(address: string | null) {
  return useQuery<UserProfile | null>({
    queryKey: address ? queryKeys.profile(address) : ["profile", "none"],
    queryFn: () => (address ? getUserProfile(address) : null),
    // Don't refetch when address is null
    enabled: address !== null,
    // Return null immediately if address is null
    initialData: address === null ? null : undefined,
  });
}

// Hook to create user profile
export function useCreateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      profile,
      address,
    }: {
      profile: Omit<UserProfile, "address">;
      address: string;
    }) => {
      return createUserProfile(profile, address);
    },
    onSuccess: (_, { address }) => {
      toast.success("Profile created successfully");
      // Invalidate profile query to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.profile(address) });
    },
    onError: (error) => {
      console.error("Error creating profile:", error);
      toast.error("Failed to create profile");
    },
  });
}

// Hook to get feed posts
export function useFeedPosts(limit = 10) {
  return useQuery<BlogPost[]>({
    queryKey: [...queryKeys.feedPosts, limit],
    queryFn: () => getFeedPosts(limit),
    // Longer stale time for feed posts to reduce API calls
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook to get user posts
export function useUserPosts(address: string | null) {
  const enabled = !!address;

  return useQuery<BlogPost[]>({
    // Only use the query key if address exists
    queryKey: enabled
      ? queryKeys.userPosts(address as string)
      : ["userPosts", "none"],
    queryFn: () => (address ? getUserPosts(address) : []),
    enabled,
  });
}

// Hook to create blog post
export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      post,
      address,
    }: {
      post: Omit<BlogPost, "id" | "author" | "authorName" | "timestamp">;
      address: string;
    }) => {
      return createBlogPost(post, address);
    },
    onSuccess: (_, { address }) => {
      toast.success("Post created successfully");
      // Invalidate both feed and user posts queries
      queryClient.invalidateQueries({ queryKey: queryKeys.feedPosts });
      queryClient.invalidateQueries({ queryKey: queryKeys.userPosts(address) });
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    },
  });
}

// Hook to get a single blog post by ID
export function usePost(id: string | null) {
  const enabled = !!id;

  return useQuery<BlogPost | null>({
    // Only use the query key if id exists
    queryKey: enabled ? queryKeys.post(id as string) : ["post", "none"],
    queryFn: () => (id ? getPost(id) : null),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
