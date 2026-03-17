import "./header.css";

export default function Header({ onMenuClick }) {
  return (
    <header className="header">
      <button className="menu-button" onClick={onMenuClick}>
        ☰
      </button>

      <div className="header-brand">
      </div>

      <button className="login-button">
        Login
      </button>
    </header>
  );
}