import { ReactNode, useEffect, useState } from "react";
import { useArweave } from "../contexts/ArweaveProvider";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface RouteGuardProps {
  children: ReactNode;
  requireProfile?: boolean;
}

export default function RouteGuard({
  children,
  requireProfile = true,
}: RouteGuardProps) {
  const { address, profile, loading, addressLoading } = useArweave();
  const navigate = useNavigate();
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    // Skip checks if already completed
    if (checkedAuth) return;

    // Don't check until initial loading is complete
    if (addressLoading) return;

    // After address loading is complete, we can make decisions
    if (!addressLoading) {
      // No wallet connected
      if (!address) {
        toast.error("Please connect your wallet first");
        navigate("/");
        setCheckedAuth(true);
        return;
      }

      // Address exists, but we're still loading profile
      if (address && loading) return;

      // Address exists, profile loaded, but no profile found and it's required
      if (requireProfile && !profile && !loading) {
        toast.error("Please create a profile first");
        navigate("/");
        setCheckedAuth(true);
        return;
      }

      // All checks passed
      setCheckedAuth(true);
    }
  }, [
    address,
    profile,
    loading,
    addressLoading,
    navigate,
    requireProfile,
    checkedAuth,
  ]);

  // Show loading only during initial checks, and only if address exists
  // This prevents infinite loading state when wallet is disconnected
  if (!checkedAuth && (loading || addressLoading) && address) {
    return (
      <div className="flex items-center justify-center h-full min-h-[70vh]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // If we don't have address or profile (where required) after checks,
  // we should have already redirected. If we haven't, do an additional check.
  if (checkedAuth && (!address || (requireProfile && !profile))) {
    // This is a fallback to ensure we don't show content without auth
    // It shouldn't normally be reached due to the useEffect redirect
    if (!address) {
      navigate("/");
      return null;
    }
  }

  // All checks passed, render children
  return <>{children}</>;
}
