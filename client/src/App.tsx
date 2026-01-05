import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { PopUpProvider } from "@/contexts/PopUpContext";
import Home from "@/pages/home";
import ChatButton from "@/components/ChatButton";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PopUpProvider>
        <Router />
        <ChatButton />
        <Toaster />
      </PopUpProvider>
    </QueryClientProvider>
  );
}

export default App;
