import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProjectList from "./pages/ProjectList";
import ProjectDetail from "./pages/ProjectDetail";
import AdminImport from "./pages/AdminImport";
import Pricing from "./pages/Pricing";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCancel from "./pages/SubscriptionCancel";
import ManageSubscription from "./pages/ManageSubscription";
import MyInvestments from "./pages/MyInvestments";
import Calculator from "./pages/Calculator";
import PremiumDatabase from "./pages/PremiumDatabase";
import Contact from "./pages/Contact";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminInvestments from "./pages/admin/AdminInvestments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/premium-database" element={<PremiumDatabase />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/investments" element={<AdminInvestments />} />
          <Route path="/admin/import" element={<AdminImport />} />
          <Route path="/admin/analytics" element={<AdminDashboard />} />

          <Route path="/pricing" element={<Pricing />} />
          <Route path="/subscription/success" element={<SubscriptionSuccess />} />
          <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
          <Route path="/subscription/manage" element={<ManageSubscription />} />
          <Route path="/my-investments" element={<MyInvestments />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
