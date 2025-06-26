
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import DoctorDetail from "./pages/DoctorDetail";
import HospitalDetail from "./pages/HospitalDetail";
import SearchResults from "./pages/SearchResults";
import Dashboard from "./pages/Dashboard";
import ConsultationBooking from "./pages/ConsultationBooking";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorRegistration from "./pages/DoctorRegistration";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/consultation-booking" element={<ConsultationBooking />} />
                <Route path="/doctor/:id" element={<DoctorDetail />} />
                <Route path="/hospital/:id" element={<HospitalDetail />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor-registration" element={<DoctorRegistration />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
