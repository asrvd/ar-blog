import Layout from "../components/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { formatDistance } from "date-fns";
import { useFeedPosts } from "../hooks/useArweaveQueries";
import { Link } from "react-router";
import { AppreciateButton } from "../components/ui/appreciate-button";
import { useActiveAddress } from "arweave-wallet-kit";

export default function Feed() {
  const {
    data: posts = [],
    isLoading: postsLoading,
    isError,
  } = useFeedPosts(20);

  const address = useActiveAddress();

  console.log(posts);

  // Format relative time
  const formatTime = (timestamp: number) => {
    return formatDistance(timestamp, new Date(), { addSuffix: true });
  };

  return (
    <Layout>
      <div className="flex flex-col p-4 lg:px-24 gap-6 max-w-4xl mx-auto w-full py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif leading-tight">Feed</h1>
          <p className="text-muted-foreground leading-tight">
            Discover the latest posts from the community
          </p>
        </div>

        <div className="grid gap-4">
          {/* Loading state while address or posts are loading */}
          {postsLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading posts...
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-muted-foreground">
              Error loading posts. Please try again later.
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Card
                key={post.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-serif">{post.title}</CardTitle>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(post.timestamp)}
                    </span>
                  </div>
                  <CardDescription className="text-sm">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm">{post.content}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <p className="text-sm">
                        by{" "}
                        <Link
                          to={`/profile/${post.author}`}
                          className="text-sm font-medium hover:underline truncate max-w-[100px]"
                        >
                          {post.authorName || post.author.substring(0, 8)}
                        </Link>
                      </p>
                      {/* Only show appreciate button if the user is not the author */}
                      {address && address !== post.author && (
                        <AppreciateButton
                          author={post.author}
                          postId={post.id}
                        />
                      )}
                    </div>
                    <Link
                      to={`/post/${post.id}`}
                      className="text-xs underline hover:text-primary"
                    >
                      Read more
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No posts found. Be the first to publish on ARblog!
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
