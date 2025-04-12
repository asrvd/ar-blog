import { useState, FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { Input } from "./input";
import { HeartHandshake, Loader2 } from "lucide-react";
import { sendAppreciation } from "../../lib/arweave";
import { useActiveAddress } from "arweave-wallet-kit";
import { toast } from "sonner";

interface AppreciateButtonProps {
  author: string;
  postId: string;
}

const AppreciateButton: FC<AppreciateButtonProps> = ({ author }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const address = useActiveAddress();

  const presetAmounts = [
    { value: "1", label: "1 AR" },
    { value: "2", label: "2 AR" },
    { value: "5", label: "5 AR" },
  ];

  const handleAppreciate = async (amount: string) => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (address === author) {
      toast.error("You cannot appreciate your own post");
      return;
    }

    try {
      setIsLoading(true);
      setSelectedPreset(amount);

      const txId = await sendAppreciation(author, amount, address);

      toast.success(
        <div className="flex flex-col gap-1">
          <p>Appreciation sent successfully! 🎉</p>
          <p className="text-xs break-all">{txId}</p>
        </div>
      );

      setIsOpen(false);
      setCustomAmount("");
      setSelectedPreset(null);
    } catch (error) {
      console.error("Error sending appreciation:", error);
      toast.error("Failed to send appreciation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomAppreciate = async () => {
    if (!customAmount || parseFloat(customAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await handleAppreciate(customAmount);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <HeartHandshake className="h-4 w-4" />
          Appreciate
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Appreciate the author</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {presetAmounts.map((preset) => (
          <DropdownMenuItem
            key={preset.value}
            disabled={isLoading}
            onClick={() => handleAppreciate(preset.value)}
            className="cursor-pointer"
          >
            {isLoading && selectedPreset === preset.value ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <HeartHandshake className="h-4 w-4 mr-2" />
            )}
            {preset.label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <div className="p-2">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              disabled={isLoading}
              min="0.000000000001"
              step="0.1"
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={handleCustomAppreciate}
              disabled={isLoading || !customAmount}
              className="whitespace-nowrap"
            >
              {isLoading && selectedPreset === customAmount ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Send AR
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Export both the new name and the old name for backward compatibility
export { AppreciateButton };
export { AppreciateButton as RewardButton };
