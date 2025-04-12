import { QueryClient } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reduce network requests with longer staleTime
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Disable refetchOnWindowFocus to prevent additional requests when switching tabs
      refetchOnWindowFocus: false,
      // Set retry to false or a low number to avoid hammering the API when rate limited
      retry: 1,
      // Implement exponential backoff for retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Cache results for 10 minutes even after becoming inactive
      gcTime: 1000 * 60 * 10,
    },
  },
});
