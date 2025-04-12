import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import Layout from "../components/layout";
import { useUserProfileQuery, useUserPosts } from "../hooks/useArweaveQueries";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { formatDistance } from "date-fns";
import { Link } from "react-router";
import type { BlogPost } from "../lib/arweave";
import { AppreciateButton } from "../components/ui/appreciate-button";
import { useActiveAddress } from "arweave-wallet-kit";

export default function PublicProfile() {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const currentUserAddress = useActiveAddress();

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
  } = useUserProfileQuery(address || null);

  const {
    data,
    isLoading: postsLoading,
    isError: postsError,
  } = useUserPosts(address || null);

  // Ensure posts is always a properly typed array
  const posts = (data as BlogPost[]) || [];

  useEffect(() => {
    // Scroll to top when profile loads
    window.scrollTo(0, 0);
  }, [address]);

  // Format relative time
  const formatTime = (timestamp: number) => {
    return formatDistance(timestamp, new Date(), { addSuffix: true });
  };

  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };

  // Loading state
  if (profileLoading || postsLoading) {
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

  // Error state or profile not found
  if (profileError || !profile) {
    return (
      <Layout>
        <div className="flex flex-col p-4 lg:px-24 gap-8 max-w-4xl mx-auto w-full py-8 min-h-[70vh] justify-center items-center">
          <div className="text-center">
            <p className="text-muted-foreground">
              Profile not found or error loading profile.
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
      <div className="flex flex-col p-4 lg:px-24 gap-8 max-w-4xl mx-auto w-full py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="w-fit"
          onClick={handleBack}
          size="sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

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

            {/* Show appreciate button if viewing someone else's profile */}
            {currentUserAddress && currentUserAddress !== address && (
              <div className="mt-2">
                <AppreciateButton author={address || ""} postId="profile" />
              </div>
            )}
          </div>
        </div>

        {/* User Posts */}
        <h3 className="text-xl font-serif -mb-4">{profile.name}'s posts //</h3>
        {postsError ? (
          <div className="text-center py-8 text-muted-foreground">
            Error loading posts.
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
            This user hasn't published any posts yet.
          </div>
        )}
      </div>
    </Layout>
  );
}
