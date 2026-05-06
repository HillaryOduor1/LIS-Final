// src/App.tsx
import * as React from "react";
import { BrowserRouter, Routes, Route,  useLocation } from "react-router-dom";
import { useContent } from "./content/useContext";

import PublicLayout from "./Layout/PublicLayout";
import HomePage from "./pages/HomePage";
import ResearchPage from "./pages/ResearchPage";
//import SettingsPage from "./components/settings/settingsPage";

import { ThemeProvider } from "./components/theme-provider";
import { SettingsProvider } from "./stores/settings-store";
import { ContentProvider } from "./content/ContentProvider";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import { trackPage } from './analytics';
import { useEffect } from "react";


function AppContent() {
  const { content } = useContent();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  useEffect(() => {
    trackPage(location.pathname);
  }, [location]);

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark text-[#0d1b14] dark:text-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="size-12 bg-primary rounded-xl opacity-20" />
          <p className="text-sm font-medium opacity-50 tracking-widest uppercase">
            Loading application...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Global components */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Routes */}
      <Routes>
        {/* Public Routes with layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Admin Routes - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-background-light dark:bg-background-dark pt-16">
                {/* Admin sidebar is always visible on desktop */}
                <div className="hidden md:block">
                  <Sidebar isOpen={true} toggleSidebar={() => {}} />
                </div>
                <div className="flex-1 md:ml-64 p-8">
                  {/*<SettingsPage />*/}
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/:tab"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-background-light dark:bg-background-dark pt-16">
                <div className="hidden md:block">
                  <Sidebar isOpen={true} toggleSidebar={() => {}} />
                </div>
                <div className="flex-1 md:ml-64 p-8">
                  {/*<SettingsPage />*/}
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <AuthProvider>
          <SettingsProvider>
            <ContentProvider>
              <AppContent />
            </ContentProvider>
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
