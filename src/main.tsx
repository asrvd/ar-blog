import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ArweaveWalletKit } from "arweave-wallet-kit";
import { BrowserRouter, Routes, Route } from "react-router";
import Feed from "./pages/Feed.tsx";
import Compose from "./pages/Compose.tsx";
import Profile from "./pages/Profile.tsx";
import Post from "./pages/Post.tsx";
import PublicProfile from "./pages/PublicProfile.tsx";
import { ArweaveProvider } from "./contexts/ArweaveProvider.tsx";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ArweaveWalletKit
        config={{
          permissions: ["ACCESS_ADDRESS", "SIGN_TRANSACTION"],
          ensurePermissions: true,
          appInfo: {
            name: "ARblog",
          },
        }}
      >
        <BrowserRouter>
          <ArweaveProvider>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/post/:id" element={<Post />} />
              <Route path="/profile/:address" element={<PublicProfile />} />
              <Route path="/compose" element={<Compose />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
            <Toaster position="top-center" />
          </ArweaveProvider>
        </BrowserRouter>
      </ArweaveWalletKit>
    </QueryClientProvider>
  </StrictMode>
);
