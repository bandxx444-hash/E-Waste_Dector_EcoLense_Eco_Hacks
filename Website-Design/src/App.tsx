import { useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScanProvider } from "@/context/ScanContext";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/Footer";
import Index from "./pages/Index.tsx";
import HowItWorks from "./pages/HowItWorks.tsx";
import UploadPage from "./pages/UploadPage.tsx";
import DiagnosticsPage from "./pages/DiagnosticsPage.tsx";
import LoadingPage from "./pages/LoadingPage.tsx";
import ListingsPreviewPage from "./pages/ListingsPreviewPage.tsx";
import ResultsPage from "./pages/ResultsPage.tsx";
import ListingPage from "./pages/ListingPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import NotFound from "./pages/NotFound.tsx";

function GlowCursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [ring, setRing] = useState({ x: -200, y: -200 });
  const ringRef = useRef({ x: -200, y: -200 });
  const mouseRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      ringRef.current = {
        x: lerp(ringRef.current.x, mouseRef.current.x, 0.12),
        y: lerp(ringRef.current.y, mouseRef.current.y, 0.12),
      };
      setRing({ ...ringRef.current });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Outer ring — lags behind */}
      <div
        className="pointer-events-none fixed z-[9997]"
        style={{
          left: ring.x - 16,
          top: ring.y - 16,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1.5px solid hsl(153 70% 48% / 0.55)",
          boxShadow: "0 0 8px 0 hsl(153 70% 52% / 0.15)",
        }}
      />
      {/* Inner dot — exact */}
      <div
        className="pointer-events-none fixed z-[9998]"
        style={{
          left: pos.x - 3,
          top: pos.y - 3,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "hsl(153 70% 52%)",
          boxShadow: "0 0 6px 2px hsl(153 70% 52% / 0.4)",
        }}
      />
    </>
  );
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GlowCursor />
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScanProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/scan" element={<UploadPage />} />
            <Route path="/diagnostics" element={<DiagnosticsPage />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/listings-preview" element={<ListingsPreviewPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/listing" element={<ListingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </ScanProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
