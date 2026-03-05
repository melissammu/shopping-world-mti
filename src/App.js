import { Routes, Route } from "react-router-dom";
import SitePage from "./pages/sitePages";
import AmazonPage from "./pages/amazonPage";
import SheinPage from "./pages/sheinPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SitePage />} />
      <Route path="/amazon" element={<AmazonPage />} />
      <Route path="/shein" element={<SheinPage />} />
    </Routes>
  );
}