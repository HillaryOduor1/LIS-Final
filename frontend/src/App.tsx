import * as React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useContent } from "./content/useContext";
import { ThemeProvider } from "./components/theme-provider";
import { SettingsProvider } from "./stores/settings-store";
import { ContentProvider } from "./content/ContentProvider";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { trackPage } from './analytics';
//import { restoreScrollPosition, saveScrollPosition }from './utils/' 
import { restoreScrollPosition, saveScrollPosition } from './utils/scrollPersistence'; 
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUSe";
import Accessibility from "./pages/Accessibility";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const ResearchPage = React.lazy(() => import("./pages/ResearchPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const PublicLayout = React.lazy(() => import("./Layout/PublicLayout"));
const Navbar = React.lazy(() => import("./components/Navbar"));
const Sidebar = React.lazy(() => import("./components/Sidebar/Sidebar"));

function AppContent() {
  const { content } = useContent();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    restoreScrollPosition();
    const beforeUnload = () => saveScrollPosition(window.scrollY);
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, []);

  React.useEffect(() => {
    saveScrollPosition(window.scrollY);
  }, [location.pathname]);

  React.useEffect(() => {
    trackPage(location.pathname);
  }, [location]);

  // Gesture: swipe back
  React.useEffect(() => {
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartX = e.changedTouches[0].screenX; };
    const onTouchEnd = (e: TouchEvent) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (diff > 100) window.history.back();
    };
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark text-[#0d1b14] dark:text-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="size-12 bg-primary rounded-xl opacity-20" />
          <p className="text-sm font-medium opacity-50 tracking-widest uppercase">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <React.Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <div className="relative min-h-screen">
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main id="main-content" tabIndex={-1}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/research" element={<ResearchPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfUse />} />
              <Route path="/accessibility" element={<Accessibility />} />
            </Route>
            <Route path="/admin" element={
              <ProtectedRoute>
                <div className="flex min-h-screen bg-background-light dark:bg-background-dark pt-16">
                  <div className="hidden md:block"><Sidebar isOpen={true} toggleSidebar={() => {}} /></div>
                  <div className="flex-1 md:ml-64 p-8"></div>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/admin/:tab" element={
              <ProtectedRoute>
                <div className="flex min-h-screen bg-background-light dark:bg-background-dark pt-16">
                  <div className="hidden md:block"><Sidebar isOpen={true} toggleSidebar={() => {}} /></div>
                  <div className="flex-1 md:ml-64 p-8"></div>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </React.Suspense>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
/*
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
      {/* Global components /}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Routes /}
      <Routes>
        {/* Public Routes with layout /}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Admin Routes - Protected /}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-background-light dark:bg-background-dark pt-16">
                {/* Admin sidebar is always visible on desktop /}
                <div className="hidden md:block">
                  <Sidebar isOpen={true} toggleSidebar={() => {}} />
                </div>
                <div className="flex-1 md:ml-64 p-8">
                  {/*<SettingsPage />/}
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
                  {/*<SettingsPage />/}
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
    <ThemeProvider defaultTheme="system">
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
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
}*/
