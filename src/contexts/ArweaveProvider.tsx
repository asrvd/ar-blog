import { createContext, ReactNode, useContext } from "react";
import { useActiveAddress } from "arweave-wallet-kit";
import { UserProfile } from "../lib/arweave";
import {
  useUserProfileQuery,
  useCreateUserProfile,
} from "../hooks/useArweaveQueries";
import { toast } from "sonner";

interface ArweaveContextType {
  address: string | null;
  profile: UserProfile | null;
  loading: boolean;
  addressLoading: boolean;
  isProfileCreated: boolean;
  createProfile: (name: string, bio: string) => Promise<boolean>;
}

const ArweaveContext = createContext<ArweaveContextType | undefined>(undefined);

export function ArweaveProvider({ children }: { children: ReactNode }) {
  const address = useActiveAddress();

  // Consider address loading until we get a value (even null is a value, undefined means still loading)
  const addressLoading = typeof address === "undefined";

  // Only start profile query when address is available (not undefined)
  const { data: profile, isLoading: profileLoading } = useUserProfileQuery(
    addressLoading ? null : address || null
  );

  const createProfileMutation = useCreateUserProfile();

  // Create a new user profile
  const createProfile = async (name: string, bio: string) => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return false;
    }

    try {
      const joinDate = new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      await createProfileMutation.mutateAsync({
        profile: { name, bio, joinDate },
        address,
      });

      return true;
    } catch {
      // Error handling is already done in the mutation hooks
      return false;
    }
  };

  // Consider loading as true if either address is loading or profile is loading
  const loading = addressLoading || profileLoading;

  const contextValue: ArweaveContextType = {
    address: addressLoading ? null : address || null,
    profile: profile as UserProfile | null,
    loading,
    addressLoading,
    isProfileCreated: !!profile,
    createProfile,
  };

  return (
    <ArweaveContext.Provider value={contextValue}>
      {children}
    </ArweaveContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useArweave = () => {
  const context = useContext(ArweaveContext);
  if (context === undefined) {
    throw new Error("useArweave must be used within an ArweaveProvider");
  }
  return context;
};
