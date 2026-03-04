import React from 'react';
export default function SitePage(){
const abrirLink = (url) => {
  if (!url) return;

  // Safari/iPhone: más estable abrir así
  const nuevaVentana = window.open(url, "_blank", "noopener,noreferrer");

  // Si Safari bloquea la nueva pestaña, abre en la misma
  if (!nuevaVentana) {
    window.location.href = url;
  }
};
 return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        height: "100vh",
        backgroundColor: "#000000",
        position: "relative",
      }}
    >
      {/* LOGO ARRIBA CENTRADO */}
      <div className="logo-container">
        <img src="/logo.png" alt="MV Logo" className="logo-img" />
      </div>

      {/* BOTÓN TIKTOK */}
      <button
       onClick={() => abrirLink("https://vt.tiktok.com/ZS9evc46RRqcM-2SCrz/")}
        style={{
          backgroundColor: "#ecce09",
          color: "#fff",
          padding: "20px 120px",
          borderRadius: "90px",
          textDecoration: "none",
          fontWeight: "bold",
           fontSize:"60px",
        }}
      >
        👉 Clique agora - Vitrine TikTok Shop
      </button>

      {/* BOTÓN AMAZON */}
      <button
       onClick={() => abrirLink("https://a.co/d/0cW0YAXb") }
        style={{
          backgroundColor: "#FF9900",
          color: "#000",
          padding: "20px 120px",
          borderRadius: "90px",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize:"60px",

        }}
      >
        👉 Clique agora - Amazon
      </button>
 <button
       onClick={() => abrirLink("https://onelink.shein.com/31/5ickfrxc1897")}
        style={{
          backgroundColor: "#FF9900",
          color: "#000",
          padding: "20px 120px",
          borderRadius: "90px",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize:"60px",

        }}
      >
        👉 vestido longo shein  
      </button>

      {/* MARCA DE AGUA ABAJO */}
      <div
        style={{
          position: "inferior",
          bottom: "10px",
          fontSize: "30px",
          fontWeight: "bold",
          letterSpacing: "2px",
        }}
      >
        <span style={{ color: "rgba(180,180,180,0.15)" }}>MV.</span>
      </div>
    </div>
  );
}
       