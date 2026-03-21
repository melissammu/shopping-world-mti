import { useState } from "react";
import "./Header.css";
import SideMenu from "./SideMenu.js ";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <header className="header">
      <button
        className="menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

     <button
       className="login-button"
       onClick={() => navigate("/login")}
      >
              Login
    </button>

      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </header>
  );
}