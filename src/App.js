import OpenBrowserPage from "./pages/OpenBrowserPage";
import React from "react";
import { Routes, Route } from "react-router-dom";
import SitePage from "./pages/sitePages";
import AmazonPage from "./pages/amazonPage";
import AmazonUsaPage from "./pages/amazonUsaPage";
import SheinPage from "./pages/sheinPage";
import SearchPage from "./pages/searchPage";
import RegistroAliadaPage from "./pages/RegistroAliadaPage";

export default function App() {
  return (
    <Routes>
      <Route path="/search" element={<SearchPage />} />
      <Route path="/" element={<OpenBrowserPage />} />
      <Route path="/home" element={<SitePage />} />
      <Route path="/amazon" element={<AmazonPage />} />
      <Route path="/amazonusa" element={<AmazonUsaPage />} />
      <Route path="/shein" element={<SheinPage />} />
      <Route path="/home" element={<SitePage />} />
      <Route path="/registro-aliada" element={<RegistroAliadaPage />} />
    </Routes>
  );
}