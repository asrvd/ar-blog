import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import Layout from "../components/layout";
import { usePost } from "../hooks/useArweaveQueries";
import { formatDistance } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import type { BlogPost } from "../lib/arweave";
import { AppreciateButton } from "../components/ui/appreciate-button";
import { useActiveAddress } from "arweave-wallet-kit";

export default function Post() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = usePost(id || null);
  const address = useActiveAddress();

  // Properly type the post data
  const post = data as unknown as BlogPost | null;

  useEffect(() => {
    // Scroll to top when post loads
    window.scrollTo(0, 0);
  }, [id]);

  // Format relative time
  const formatTime = (timestamp: number) => {
    return formatDistance(timestamp, new Date(), { addSuffix: true });
  };

  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col p-4 lg:px-24 gap-8 max-w-3xl mx-auto w-full py-8 min-h-[70vh] justify-center items-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading post...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (isError || !post) {
    return (
      <Layout>
        <div className="flex flex-col p-4 lg:px-24 gap-8 max-w-3xl mx-auto w-full py-8 min-h-[70vh] justify-center items-center">
          <div className="text-center">
            <p className="text-muted-foreground">
              Post not found or error loading post.
            </p>
            <Button variant="outline" onClick={handleBack} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col p-4 lg:px-24 gap-8 max-w-3xl mx-auto w-full py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="w-fit"
          onClick={handleBack}
          size="sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        {/* Post header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-serif">{post.title}</h1>
          <p className="text-lg text-muted-foreground">{post.description}</p>

          {/* Author info and metadata */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
            <Link
              to={`/profile/${post.author}`}
              className="hover:opacity-80 group"
            >
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/glass/svg?seed=${post.author}`}
                  />
                  <AvatarFallback>
                    {post.authorName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col group leading-tight">
                  <span className="text-sm group-hover:underline">
                    {post.authorName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(post.timestamp)}
                  </span>
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              {/* Only show appreciate button if the user is not the author */}
              {address && address !== post.author && (
                <AppreciateButton author={post.author} postId={post.id} />
              )}
              {post.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Post content */}
        <div className="prose prose-zinc max-w-none">
          {post.content.split("\n").map((paragraph: string, index: number) => {
            // Skip empty paragraphs
            if (!paragraph.trim()) return null;
            return <p key={index}>{paragraph}</p>;
          })}
        </div>
      </div>
    </Layout>
  );
}
