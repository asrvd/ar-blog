import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useArweave } from "../contexts/ArweaveProvider";
import { toast } from "sonner";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileDialog({
  open,
  onOpenChange,
}: ProfileDialogProps) {
  const { createProfile, loading } = useArweave();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    if (bio.length > 100) {
      toast.error("Bio must be 100 characters or less");
      return;
    }

    try {
      const success = await createProfile(name, bio);
      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Your Profile</DialogTitle>
          <DialogDescription>
            Create a profile to start using AR-blog. This information will be
            stored on Arweave.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">
              Bio
            </label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short bio about yourself (100 chars max)"
              maxLength={100}
            />
            <div className="text-xs text-right text-muted-foreground">
              {bio.length}/100 characters
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
