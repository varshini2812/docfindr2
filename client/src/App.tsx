import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import Header from "./components/Header";
import UploadPage from "./pages/UploadPage";
import SearchPage from "./pages/SearchPage";
import SummarizePage from "./pages/SummarizePage";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { DocumentProvider } from "./contexts/DocumentContext";

function Router() {
  const [location] = useLocation();
  const [title, setTitle] = useState("Upload Documents");

  // Update title based on current route
  useEffect(() => {
    switch (location) {
      case "/":
        setTitle("Upload Documents");
        break;
      case "/search":
        setTitle("Search Documents");
        break;
      case "/summarize":
        setTitle("Summarize Documents");
        break;
      default:
        setTitle("DocuFindr");
    }
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden pt-0 md:pt-0">
        <Header title={title} />
        <div className="flex-1 overflow-y-auto p-4 pt-16 md:pt-4">
          <Switch>
            <Route path="/" component={UploadPage} />
            <Route path="/search" component={SearchPage} />
            <Route path="/summarize" component={SummarizePage} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DocumentProvider>
        <Router />
        <Toaster />
      </DocumentProvider>
    </QueryClientProvider>
  );
}

export default App;
