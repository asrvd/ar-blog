import { useState } from "react";
import Layout from "../components/layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useArweave } from "../contexts/ArweaveProvider";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useCreateBlogPost } from "../hooks/useArweaveQueries";

export default function Compose() {
  const {
    profile,
    address,
    loading: profileLoading,
  } = useArweave();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const createBlogPost = useCreateBlogPost();

  const handlePublish = async () => {
    // Validate inputs
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    if (!address) {
      toast.error("Please connect your wallet");
      navigate("/");
      return;
    }

    try {
      const parsedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await createBlogPost.mutateAsync({
        post: {
          title,
          description,
          content,
          tags: parsedTags,
        },
        address,
      });

      toast.success("Post published successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error publishing post:", error);
      toast.error("Failed to publish post");
    }
  };

  // Only show loading state if address exists and we're still loading profile
  if (address && profileLoading) {
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
              Please connect your wallet to compose posts.
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
              Please create a profile to create posts. If you just created your
              profile, please wait a few minutes and refresh the page.
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
      <div className="flex flex-col p-4 lg:px-24 gap-6 lg:w-2/3 mx-auto w-full py-8 min-h-screen">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif leading-tight">Compose</h1>
          <p className="text-muted-foreground leading-tight">
            Create a new post to share with the community
          </p>
        </div>

        <div className="border border-zinc-200 rounded-lg p-2 bg-zinc-50">
          <p className="text-sm text-muted-foreground text-center">
            Note: You may need to wait a few minutes before a newly created blog
            appears in the feed.
          </p>
        </div>

        <Card className="border-zinc-200">
          <CardHeader>
            <CardTitle>New Post</CardTitle>
            <CardDescription>
              Your post will be permanently stored on Arweave
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="Enter your post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Short Description
              </label>
              <Input
                id="description"
                placeholder="A brief description of your post"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <div className="relative">
                <Textarea
                  id="content"
                  placeholder="Write your post content here..."
                  className="resize-none overflow-y-auto focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 font-sans text-sm leading-relaxed min-h-[450px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                  {content.length} characters
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Tip: You can use line breaks to structure your content. Each
                empty line will create a new paragraph.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags (comma separated)
              </label>
              <Input
                id="tags"
                placeholder="arweave, blog, web3"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-zinc-200 pt-4">
            <Button variant="outline" onClick={() => navigate("/profile")}>
              Cancel
            </Button>
            <Button onClick={handlePublish} disabled={createBlogPost.isPending}>
              {createBlogPost.isPending
                ? "Publishing..."
                : "Publish to Arweave"}
            </Button>
          </CardFooter>
        </Card>

        <div className="text-xs text-muted-foreground text-center pt-4">
          Note: Once published to Arweave, your content will be permanently
          stored on the blockchain
        </div>
      </div>
    </Layout>
  );
}
