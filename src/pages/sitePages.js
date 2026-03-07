import React from "react";
import { Link } from "react-router-dom";
import "./sitePages.css";

export default function SitePage() {
  const tiktokShopLink = "https://vt.tiktok.com/ZS9dyaRedqTsc-OlTc0/";

  return (
    <div className="home-page">
      <div className="home-card">
        <img
          src="/avatar/shop_word.png"
          alt="Shopping World"
          className="home-logo"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        <h1 className="home-title">Shopping World</h1>

        <p className="home-subtitle">
          Seu shopping mundial em um só lugar
        </p>

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