
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ChatBot from "./components/chat/chat-bot";
import LiveBackground from "./components/live-background";
import { AuthProvider } from "./contexts/AuthContext";
import { ProfileProvider } from "./contexts/ProfileContext";

const queryClient = new QueryClient();

const App = () => {
  const [chatProductId, setChatProductId] = useState<number | undefined>(undefined);
  const [chatProductTitle, setChatProductTitle] = useState<string | undefined>(undefined);
  const [chatOwnerName, setChatOwnerName] = useState<string | undefined>(undefined);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProfileProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <LiveBackground />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={
                  <Dashboard 
                    onMessageOwner={(productId, title, owner) => {
                      setChatProductId(productId);
                      setChatProductTitle(title);
                      setChatOwnerName(owner);
                    }}
                  />
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ChatBot 
                productId={chatProductId} 
                productTitle={chatProductTitle} 
                ownerName={chatOwnerName}
              />
            </BrowserRouter>
          </TooltipProvider>
        </ProfileProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
