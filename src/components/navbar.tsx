import { ConnectButton } from "arweave-wallet-kit";
import { useState, useEffect } from "react";
import { Menu, Home, Newspaper, PenLine, User } from "lucide-react";
import { useLocation } from "react-router";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "../components/ui/sheet";
import { Button } from "../components/ui/button";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close sheet when route changes
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Navigation links with icons
  const navLinks = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
    {
      href: "/feed",
      label: "Feed",
      icon: <Newspaper className="h-4 w-4 mr-2" />,
    },
    {
      href: "/compose",
      label: "Compose",
      icon: <PenLine className="h-4 w-4 mr-2" />,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: <User className="h-4 w-4 mr-2" />,
    },
  ];

  // Check if current path matches link
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex justify-between items-center p-2 lg:px-24 border-b backdrop-blur-sm border-zinc-200 sticky top-0 z-50 bg-white/90">
      <a href="/">
        <h3 className="text-3xl font-serif">
          AR<span className="italic">blog</span>
        </h3>
      </a>
      <div className="flex items-center gap-6">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {navLinks.slice(1).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm hover:underline transition-colors ${
                isActive(link.href) ? "font-medium" : ""
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile Sheet Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Menu"
              className="rounded-full"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="border-l border-zinc-200">
            <SheetHeader className="text-left pb-6">
              <SheetTitle className="text-xl font-serif">
                AR<span className="italic">blog</span> Menu
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.href}>
                  <a
                    href={link.href}
                    className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors hover:bg-zinc-100 ${
                      isActive(link.href)
                        ? "font-medium bg-zinc-100"
                        : "text-zinc-600"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </a>
                </SheetClose>
              ))}
            </nav>

            <div className="absolute bottom-6 left-0 right-0 px-6">
              <div className="text-xs text-center text-zinc-500 mb-4">
                Connect your Arweave wallet to access all features
              </div>
              <div className="flex justify-center">
                <ConnectButton
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: "10px",
                    padding: "0px 10px",
                    fontSize: "14px",
                    fontFamily: "var(--font-sans)",
                    width: "100%",
                    textAlign: "center",
                  }}
                  showBalance={false}
                  useAns={false}
                  showProfilePicture={false}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Connect Button */}
        <div className="hidden md:block">
          <ConnectButton
            style={{
              backgroundColor: "black",
              color: "white",
              borderRadius: "10px",
              padding: "0px 8px",
              fontSize: "14px",
              fontFamily: "var(--font-sans)",
            }}
            showBalance={false}
            useAns={false}
            showProfilePicture={false}
          />
        </div>
      </div>
    </div>
  );
}
