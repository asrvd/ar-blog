import Layout from "../components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useArweave } from "../contexts/ArweaveProvider";
import type { BlogPost } from "../lib/arweave";
import { formatDistance } from "date-fns";
import { useUserPosts } from "../hooks/useArweaveQueries";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const {
    profile,
    address,
    loading: profileLoading,
  } = useArweave();
  const navigate = useNavigate();
  const { data, isLoading: postsLoading } = useUserPosts(address);

  // Ensure posts is always a properly typed array
  const posts = (data as BlogPost[]) || [];


  // Format relative time
  const formatTime = (timestamp: number) => {
    return formatDistance(timestamp, new Date(), { addSuffix: true });
  };

  // Only show loading state if address exists and we're still loading profile
  if (address && (profileLoading || postsLoading)) {
    return (
      <Layout>
        <div className="flex flex-col p-4 lg:px-24 gap-8 max-w-4xl mx-auto w-full py-8 min-h-[70vh] justify-center items-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Immediately return to home if no address (handled by useEffect)
  if (!address) {
    return (
      <Layout>
        <div className="flex flex-col p-4 lg:px-24 gap-8 max-w-4xl mx-auto w-full py-8 min-h-[70vh] justify-center items-center">
          <div className="text-center">
            <p className="text-muted-foreground">
              Please connect your wallet to view your profile.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="mt-4 text-sm hover:text-zinc-800"
            >
              Return to home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="flex flex-col p-4 lg:px-24 gap-8 max-w-4xl mx-auto w-full py-8 min-h-[70vh] justify-center items-center">
          <div className="text-center">
            <p className="text-muted-foreground">
              Please create a profile to view this page. If you just created
              your profile, please wait a few minutes and refresh the page.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 text-sm underline hover:text-zinc-800"
            >
              Return to home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col p-4 lg:px-24 gap-8 max-w-4xl mx-auto w-full py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <Avatar className="w-24 h-24">
            <AvatarImage
              src={`https://api.dicebear.com/9.x/glass/svg?seed=${profile.address}`}
            />
            <AvatarFallback className="text-2xl bg-black text-white">
              {profile.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-serif">{profile.name}</h1>
              <p className="text-xs text-muted-foreground leading-tight">
                // joined {profile.joinDate}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground leading-tight">
                {profile.address}
              </p>
            </div>
            <p className="text-sm max-w-md">{profile.bio}</p>
          </div>
        </div>

        <div className="border border-zinc-200 rounded-lg p-2 bg-zinc-50">
          <p className="text-sm text-muted-foreground text-center">
            Note: If you just added a new blog post, you may need to wait a few
            minutes before it appears here.
          </p>
        </div>

        {/* User Content Tabs */}
        <h3 className="text-xl font-serif -mb-4">your posts //</h3>
        {postsLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            loading posts...
          </div>
        ) : posts.length > 0 ? (
          posts.map((post: BlogPost) => (
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
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {post.tags.join(", ")}
                  </span>
                  <div className="flex gap-2">
                    <Link
                      to={`/post/${post.id}`}
                      className="text-xs underline hover:text-primary"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            You haven't published any posts yet.
          </div>
        )}
      </div>
    </Layout>
  );
}
