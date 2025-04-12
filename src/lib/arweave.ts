import Arweave from "arweave";
import { useEffect, useState } from "react";
import { useActiveAddress } from "arweave-wallet-kit";
import { toast } from "sonner";

// Set up Arweave instance based on environment
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

// Content types
export interface UserProfile {
  address: string;
  name: string;
  joinDate: string;
  bio: string;
}

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  authorName: string;
  timestamp: number;
  tags: string[];
}

// Tags for Arweave transactions
const APP_NAME = "AR-Blog-App";
const PROFILE_TAG = "AR-Blog-Profile";
const POST_TAG = "AR-Blog-Post";

// Helper function to run GraphQL queries
async function queryTransactions(query: string) {
  const url = "https://arweave.net/graphql";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL query failed: ${response.statusText}`);
  }

  const json = await response.json();
  return json.data;
}

// Get user profile by address
export const getUserProfile = async (
  address: string
): Promise<UserProfile | null> => {
  try {
    // Query for the profile transaction using GraphQL
    const query = `
      query {
        transactions(
          tags: [
            { name: "App-Name", values: ["${APP_NAME}"] },
            { name: "Type", values: ["${PROFILE_TAG}"] },
            { name: "Address", values: ["${address}"] }
          ],
          first: 1
        ) {
          edges {
            node {
              id
            }
          }
        }
      }
    `;

    const result = await queryTransactions(query);
    const edges = result.transactions.edges;

    if (!edges || edges.length === 0) {
      return null;
    }

    // Get the most recent profile
    const txId = edges[0].node.id;
    const tx = await arweave.transactions.get(txId);
    const data = tx.get("data", { decode: true, string: true });
    return JSON.parse(data);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

// Create a user profile
export const createUserProfile = async (
  profile: Omit<UserProfile, "address">,
  address: string
) => {
  if (!address) {
    throw new Error("No wallet connected");
  }

  // Create profile transaction
  const tx = await arweave.createTransaction({
    data: JSON.stringify({ ...profile, address }),
  });

  // Add tags to make it easily searchable
  tx.addTag("Content-Type", "application/json");
  tx.addTag("App-Name", APP_NAME);
  tx.addTag("Type", PROFILE_TAG);
  tx.addTag("Address", address);

  // Sign and post the transaction
  await arweave.transactions.sign(tx);
  await arweave.transactions.post(tx);

  return tx.id;
};

// Create a blog post
export const createBlogPost = async (
  post: Omit<BlogPost, "id" | "author" | "authorName" | "timestamp">,
  address: string
) => {
  if (!address) {
    throw new Error("No wallet connected");
  }

  // Get the user profile to include the author name
  const profile = await getUserProfile(address);
  const authorName = profile?.name || "Anonymous";

  const blogPost: Omit<BlogPost, "id"> = {
    ...post,
    author: address,
    authorName,
    timestamp: Date.now(),
  };

  // Create post transaction
  const tx = await arweave.createTransaction({
    data: JSON.stringify(blogPost),
  });

  // Add tags
  tx.addTag("Content-Type", "application/json");
  tx.addTag("App-Name", APP_NAME);
  tx.addTag("Type", POST_TAG);
  tx.addTag("Author", address);

  // Add each tag as a separate transaction tag for easier querying
  post.tags.forEach((tag) => {
    tx.addTag("Post-Tag", tag.trim());
  });

  // Sign and post the transaction
  await arweave.transactions.sign(tx);
  await arweave.transactions.post(tx);

  return tx.id;
};

// Fetch blog posts for the feed
export const getFeedPosts = async (limit = 10): Promise<BlogPost[]> => {
  try {
    // Query for blog posts using GraphQL
    const query = `
      query {
        transactions(
          tags: [
            { name: "App-Name", values: ["${APP_NAME}"] },
            { name: "Type", values: ["${POST_TAG}"] }
          ],
          first: ${limit}
        ) {
          edges {
            node {
              id
            }
          }
        }
      }
    `;

    const result = await queryTransactions(query);
    const edges = result.transactions.edges;

    if (!edges || edges.length === 0) {
      return [];
    }

    const posts: BlogPost[] = [];

    for (const edge of edges) {
      try {
        const txId = edge.node.id;
        const tx = await arweave.transactions.get(txId);
        const data = tx.get("data", { decode: true, string: true });
        const post = JSON.parse(data);
        posts.push({ ...post, id: txId });
      } catch (error) {
        console.error(`Error fetching post:`, error);
      }
    }

    // Sort by timestamp, newest first
    return posts.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error fetching feed posts:", error);
    return [];
  }
};

// Fetch posts by a specific author
export const getUserPosts = async (address: string): Promise<BlogPost[]> => {
  try {
    // Query for user's blog posts using GraphQL
    const query = `
      query {
        transactions(
          tags: [
            { name: "App-Name", values: ["${APP_NAME}"] },
            { name: "Type", values: ["${POST_TAG}"] },
            { name: "Author", values: ["${address}"] }
          ]
        ) {
          edges {
            node {
              id
            }
          }
        }
      }
    `;

    const result = await queryTransactions(query);
    const edges = result.transactions.edges;

    if (!edges || edges.length === 0) {
      return [];
    }

    const posts: BlogPost[] = [];

    for (const edge of edges) {
      try {
        const txId = edge.node.id;
        const tx = await arweave.transactions.get(txId);
        const data = tx.get("data", { decode: true, string: true });
        const post = JSON.parse(data);
        posts.push({ ...post, id: txId });
      } catch (error) {
        console.error(`Error fetching post:`, error);
      }
    }

    // Sort by timestamp, newest first
    return posts.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error(`Error fetching posts for user ${address}:`, error);
    return [];
  }
};

// Fetch a single blog post by its ID
export const getPost = async (id: string): Promise<BlogPost | null> => {
  try {
    const tx = await arweave.transactions.get(id);
    const data = tx.get("data", { decode: true, string: true });
    const post = JSON.parse(data);
    return { ...post, id };
  } catch (error) {
    console.error(`Error fetching post with ID ${id}:`, error);
    return null;
  }
};

// Hook to check if a user has a profile
export const useUserProfile = () => {
  const address = useActiveAddress();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (!address) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userProfile = await getUserProfile(address);

        // Only update state if the component is still mounted
        if (isMounted) {
          setProfile(userProfile);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching user profile:", error);
          toast.error("Failed to fetch profile");
          setLoading(false);
        }
      }
    };

    fetchProfile();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [address]);

  return { profile, loading };
};
