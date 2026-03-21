import "./SideMenu.css";
import { useNavigate } from "react-router-dom";

export default function SideMenu({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      <div className="menu-overlay" onClick={onClose}></div>

      <div className="dropdown-menu">
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
    navigate("/about");
    onClose();
  }}
>
  📄 Quem somos
</button>

<button
  className="dropdown-item"
  onClick={() => {
    navigate("/ajuda");
    onClose();
  }}
>
  ❓ Ajuda
</button>

<button
  className="dropdown-item"
  onClick={() => {
    navigate("/registro-aliada");
    onClose();
  }}
>
  ❤️ Quero ser afiliada
</button>

<button
  className="dropdown-item logout-button"
  onClick={() => {
    alert("Função sair será conectada depois.");
    onClose();
  }}
>
  🚪 Sair
</button>
        </div>
      </div>
    </>
  );
}