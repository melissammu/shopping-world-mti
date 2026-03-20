import React from "react";

export default function AffiliateDashboardPage() {
  return (
    <div style={{ 
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f7f7f7"
    }}>
      <div style={{
        background: "#fff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>
        <h1>Painel da Afiliada</h1>
        <p>Login realizado com sucesso 🎉</p>
      </div>
    </div>
  );
}