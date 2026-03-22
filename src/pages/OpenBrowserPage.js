import React from "react";
import { useNavigate } from "react-router-dom";

export default function OpenBrowserPage() {
  const navigate = useNavigate();

  const abrirCatalogo = () => {
    navigate("/home");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "40px 30px",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
          maxWidth: "420px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            marginBottom: "10px",
            color: "#1f1f1f",
          }}
        >
          Abrir catálogo
        </h1>

        <p
          style={{
            marginBottom: "30px",
            color: "#555",
            fontSize: "16px",
            lineHeight: "1.5",
          }}
        >
          Para ver todos os produtos, clique agora!
        </p>

       <button
  onClick={abrirCatalogo}
  style={{
    padding: "15px 30px",
    fontSize: "18px",
    borderRadius: "10px",
    border: "none",
    background: "#f3c90d",
    color: "#0a0909",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  Busca inteligente
</button>
      </div>
    </div>
  );
}
