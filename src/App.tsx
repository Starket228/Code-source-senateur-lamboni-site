

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteProvider } from "./context/SiteContext";
import { LanguageProvider } from "./context/LanguageContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Activities from "./pages/Activities";
import Documents from "./pages/Documents";
import Contact from "./pages/Contact";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import ProgramDetail from "./pages/ProgramDetail";
import Media from "./pages/Media";
import Admin from "./pages/Admin";
import AdminNews from "./pages/AdminNews";
import AdminPrograms from "./pages/AdminPrograms";
import AdminActivities from "./pages/AdminActivities";
import AdminDocuments from "./pages/AdminDocuments";
import AdminHero from "./pages/AdminHero";
import AdminMedia from "./pages/AdminMedia";
import AdminMessages from "./pages/AdminMessages";
import AdminAbout from "./pages/AdminAbout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <SiteProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programs/:id" element={<ProgramDetail />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/media" element={<Media />} />
              <Route path="/admin" element={<Admin />}>
                <Route path="news" element={<AdminNews />} />
                <Route path="programs" element={<AdminPrograms />} />
                <Route path="activities" element={<AdminActivities />} />
                <Route path="documents" element={<AdminDocuments />} />
                <Route path="hero" element={<AdminHero />} />
                <Route path="about" element={<AdminAbout />} />
                <Route path="media" element={<AdminMedia />} />
                <Route path="messages" element={<AdminMessages />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SiteProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

