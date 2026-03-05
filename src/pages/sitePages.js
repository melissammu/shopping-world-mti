import React from "react";
import "./sitePages.css";

export default function SitePage() {

  const abrirLink = (url) => {
    if (!url) return;

    const nuevaVentana = window.open(url, "_blank", "noopener,noreferrer");

    if (!nuevaVentana) {
      window.location.href = url;
    }
  };

  return (

    <div className="site-container">

      {/* LOGO FUERA DEL CONTENEDOR */}
      <img
        src="/logonvo.png"

        className="logo-top"
      />

      {/* TARJETA CENTRAL */}
      <div className="site-card">

        <div className="links-container">

          <button
            className="site-button primary"
            onClick={() => abrirLink("LINK_TIKTOK")}
            type="button"
          >
            Clique agora - Vitrine TikTok Shop
          </button>

          <button
            className="site-button"
            onClick={() => abrirLink("LINK_AMAZON")}
            type="button"
          >
            Clique agora - Amazon
          </button>

          <button
            className="site-button"
            onClick={() => abrirLink("LINK_SHEIN")}
            type="button"
          >
            Clique agora - Shein
          </button>

        </div>

      </div>

    </div>
  );
}