import OpenBrowserPage from "./pages/OpenBrowserPage";
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import SitePage from "./pages/sitePage";
import AmazonPage from "./pages/amazonPage";
import RedirectPage from "./pages/RedirectPage";
import SheinPage from "./pages/sheinPage";
import ShopeePage from "./pages/shopeePage";
import MercadoLiPage from "./pages/mercadoLiPage";
import SearchPage from "./pages/searchPage";
import RegistroAliadaPage from "./pages/RegistroAliadaPage";
import AdminAfiliadasPage from "./pages/AdminAfiliadasPage";
import AffiliateLoginPage from "./pages/AffiliateLoginPage";
import AffiliateDashboardPage from "./pages/AffiliateDashboardPage";
import AboutPage from "./pages/AboutPage";
import AjudaPage from "./pages/AjudaPage";
import LoginPage from "./pages/LoginPage";
export default function App() {
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");

  if (ref) {
    localStorage.setItem("affiliate_ref", ref);
    console.log("REF guardado:", ref);
  }
}, []);
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/ajuda" element={<AjudaPage />} />
      <Route path="/dashboard-afiliada" element={<AffiliateDashboardPage />} />
      <Route path="/login-afiliada" element={<AffiliateLoginPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/s/:store/:id" element={<RedirectPage />} />
      <Route path="/" element={<OpenBrowserPage />} />
      <Route path="/home" element={<SitePage/>} />
      <Route path="/amazon" element={<AmazonPage />} />
      <Route path="/shein" element={<SheinPage />} />
        <Route path="/shopee" element={<ShopeePage />} />
      <Route path="/mercadoli" element={<MercadoLiPage />} />
      <Route path="/registro-aliada" element={<RegistroAliadaPage />} />
      <Route path="/admin-afiliadas" element={<AdminAfiliadasPage />} />
      
    </Routes>
  );
}