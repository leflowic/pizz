import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import CustomCursor from "@/components/CustomCursor";
import ContentProtection from "@/components/ContentProtection";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Jelovnik from "@/pages/Jelovnik";
import Admin from "@/pages/Admin";
import AdminDashboard from "@/pages/AdminDashboard";
import { useState, useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/jelovnik" component={Jelovnik} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <QueryClientProvider client={queryClient}>
      {mounted && <CustomCursor />}
      <ContentProtection />
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
