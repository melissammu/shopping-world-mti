import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./sitePages.css";

export default function SitePage() {
  const tiktokShopLink = "https://vt.tiktok.com/ZS9d9bUjTKgu9-eFlCm/";
  const [search, setSearch] = useState ("")
  return (
    <div className="home-page">
      <div className="home-card">
        <img
          src="/avatar/shop_word.png"
          alt="Shopping World MTI"
          className="home-logo"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        <h1 className="home-title">Shopping World MTI</h1>

        <p className="home-subtitle">
          Seu shopping mundial num só lugar.
          
        </p>
       <div className="global-search">
  <input
    type="text"
    placeholder="🔍 Buscar produto em toda a loja..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="global-search-input"
  />
</div>
        
        <div className="home-buttons">
          <Link to="/shein" className="home-button shein-btn">
            Shein
          </Link>

          <Link to="/amazon" className="home-button amazon-btn">
            Amazon
          </Link>

          <a
            href={tiktokShopLink}
            target="_blank"
            rel="noreferrer"
            className="home-button tiktok-btn"
          >
            TikTok Shop
          </a>
        </div>
      </div>
    </div>
  );
}