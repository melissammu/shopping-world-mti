import { useState } from "react";
import "./MainHeader.css";
import SideMenu from "./SideMenu";
import { useNavigate } from "react-router-dom";

export default function MainHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
  <header className="header">

    <div className="left">
      <button
        className="menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>
    </div>

    <div className="center">
      <span className="logo">Shopping World</span>
    </div>

    <div className="right">
      <button
        className="login-button"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </div>

    <SideMenu
      isOpen={menuOpen}
      onClose={() => setMenuOpen(false)}
    />

  </header>
);
 }