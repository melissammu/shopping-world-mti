import "./SideMenu.css";
import { useNavigate } from "react-router-dom";

export default function SideMenu({ isOpen, onClose }) {
  const navigate = useNavigate();

  return (
    <div className={`dropdown-menu ${isOpen ? "open" : ""}`}>
      <button className="dropdown-close" onClick={onClose}>
        ×
      </button>

      <div className="dropdown-section">
        <p className="dropdown-title">Navegação</p>

        <button
          className="dropdown-item"
          onClick={() => {
            navigate("/home");
            onClose();
          }}
        >
          🏠 Início
        </button>

        <button
          className="dropdown-item"
          onClick={() => {
            navigate("/registro-aliada");
            onClose();
          }}
        >
          🤝 Quero ser afiliada
        </button>
      </div>

      <div className="dropdown-section">
        <p className="dropdown-title">Conta</p>

        <button className="dropdown-item">
          ⚙️ Configuração
        </button>

        <button className="dropdown-item logout">
          ↩️ Sair
        </button>
      </div>
    </div>
  );
}