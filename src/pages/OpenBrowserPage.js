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
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "28px 20px",
          borderRadius: "24px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
          maxWidth: "430px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "800",
            margin: "0 0 8px 0",
            color: "#111",
            lineHeight: "1.2",
          }}
        >
          🔥 Todo em um só lugar
        </h1>

        <p
          style={{
            color: "#555",
            fontSize: "16px",
            margin: "0 0 18px 0",
            lineHeight: "1.4",
          }}
        >
          Amazon, Shein, Shopee e Mercado Livre juntos
        </p>

        <div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "18px",
    flexWrap: "wrap"
  }}
>
  <div
    style={{
      background: "#fff",
      padding: "10px 14px",
      borderRadius: "12px",
      minWidth: "90px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}
  
  >
    
    <img
      src="/avatar/logo_amazon.png"
      alt="Amazon"
      style={{
        width: "85px",
        height: "28px",
        objectFit: "contain",
        display: "block",
        margin: "0 auto"
      }}
    />
  </div>

  <div
    style={{
      background: "#fff",
      padding: "10px 14px",
      borderRadius: "12px",
      minWidth: "90px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}
  >
    <img
      src="/avatar/logo_shein.png"
      alt="Shein"
      style={{
        width: "85px",
        height: "28px",
        objectFit: "contain",
        display: "block",
        margin: "0 auto"
      }}
    />
  </div>

  <div
    style={{
      background: "#fff",
      padding: "10px 14px",
      borderRadius: "12px",
      minWidth: "90px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}
  >
    <img
      src="/avatar/logo_mercado_livre.png"
      alt="Mercado Livre"
      style={{
        width: "85px",
        height: "28px",
        objectFit: "contain",
        display: "block",
        margin: "0 auto"
      }}
    />
</div>
 <div
    style={{
      background: "#fff",
      padding: "10px 14px",
      borderRadius: "12px",
      minWidth: "90px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}
  >
    <img
      src="/avatar/logo_shopee.jpg"
      alt="Shopee"
      style={{
        width: "85px", 
        height: "28px",
        objectFit: "contain",
        display: "block",
        margin: "0 auto"
      }}
    />
  </div>

        </div>

       <img
  src="/avatar/imagengancho_oficial.png"
  alt="Produtos de Amazon, Shein e Mercado Livre em um só lugar"
  onClick={abrirCatalogo}
  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  style={{
    width: "100%",
    borderRadius: "16px",
    marginBottom: "20px",
    cursor: "pointer",
    transition: "0.3s",
    display: "block"
  }}
/>

        <div
          style={{
            background: "#fafafa",
            borderRadius: "20px",
            padding: "24px 16px 18px",
            marginTop: "8px",
          }}
        >

          <button
            onClick={abrirCatalogo}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            style={{
              padding: "12px",
              width: "100%",
              borderRadius: "16px",
              border: "none",
              background: "#f4c400",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              transform: "scale(1)",
              transition: "0.2s",
              color: "#111",
            }}
          >
           Ver ofertas agora 🔥
          </button>
        </div>
      </div>
    </div>
  );
}