import "./App.css";
import Layout from "./components/layout";
import { useState, useEffect } from "react";
import { useArweave } from "./contexts/ArweaveProvider";
import ProfileDialog from "./components/profile-dialog";
import { useActiveAddress } from "arweave-wallet-kit";
import { DotPattern } from "./components/magicui/dot-pattern";
import { cn } from "./lib/utils";

function App() {
  const { profile, loading, addressLoading } = useArweave();
  const address = useActiveAddress();
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  useEffect(() => {
    // Only show the dialog when:
    // 1. User is connected (has address)
    // 2. Address loading is complete
    // 3. Profile data loading is complete
    // 4. No profile exists
    if (address && !addressLoading && !loading && !profile) {
      setShowProfileDialog(true);
    }
  }, [address, profile, loading, addressLoading]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center relative h-full flex-1">
        <DotPattern
          className={cn(
            "absolute inset-0 z-0 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
          )}
        />
        <div className="flex flex-col gap-6 items-center justify-center z-10 text-center py-12">
          <h2 className="lg:text-8xl text-5xl font-serif">
            AR<span className="italic">blog</span>
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground text-center max-w-lg leading-tight">
            a{" "}
            <span className="underline">safe, uncensored, & decentralized</span>{" "}
            blogging / microblogging platform built on Arweave
          </p>
        </div>
      </div>

      {/* Profile Creation Dialog */}
      <ProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
      />
    </Layout>
  );
}

export default App;
