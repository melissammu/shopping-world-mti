import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./sitePages.css";

export default function SitePage() {
  const tiktokShopLink = "https://vt.tiktok.com/ZS9d9bUjTKgu9-eF1Cm/";

  const [search, setSearch] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const { data: sheinData, error: sheinError } = await supabase
        .from("products")
        .select("*")
        .eq("store", "shein");

      const { data: amazonData, error: amazonError } = await supabase
        .from("amazon_products")
        .select("*")
        .eq("is_active", true);

      if (sheinError) {
        console.error("Erro ao buscar Shein:", sheinError);
      }

      if (amazonError) {
        console.error("Erro ao buscar Amazon:", amazonError);
      }

      const sheinFormatted = (sheinData || []).map((p) => ({
        id: `shein-${p.id}`,
        name: p.title || p.name || "Produto sem nome",
        price: p.price || "",
        image:
          (p.image_url && p.image_url.trim()) ||
          (typeof p.image === "string" && p.image.trim()) ||
          "/produtos/placeholder-shein.jpg",
        link:
          (p.link_br && p.link_br.trim()) ||
          (p.link_us && p.link_us.trim()) ||
          (p.link && p.link.trim()) ||
          "",
        store: "Shein",
      }));

      const amazonFormatted = (amazonData || []).map((p) => ({
        id: `amazon-${p.id}`,
        name: p.title || p.name || "Produto sem nome",
        price: p.price || "",
        image:
          (p.image_url && p.image_url.trim()) ||
          "/produtos/placeholder-amazon.png",
        link:
          (p.link_br && p.link_br.trim()) ||
          (p.link_us && p.link_us.trim()) ||
          (p.link && p.link.trim()) ||
          "",
        store: "Amazon",
      }));

      setAllProducts([...sheinFormatted, ...amazonFormatted]);
    }

    loadProducts();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase().trim();

    if (!term) {
      setFilteredProducts([]);
      return;
    }

    const results = allProducts.filter((product) =>
      product.name.toLowerCase().includes(term)
    );

    setFilteredProducts(results.slice(0, 8));
  }, [search, allProducts]);

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

        <p className="home-subtitle">Seu shopping mundial num só lugar.</p>

        <div className="global-search">
  <input
    type="text"
    placeholder="Buscar produto..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="global-search-input"
  />
</div>

{filteredProducts.length > 0 && (
  <div className="global-search-results">
    {filteredProducts.map((product) => (
      <div
        key={product.id}
        className="global-search-item"
        onClick={() => window.open(product.link, "_blank")}
      >
        <img src={product.image} alt={product.name} />

        <div className="global-search-info">
          <p className="global-search-name">{product.name}</p>
          <p className="global-search-store">{product.store}</p>
          <p className="global-search-price">{product.price}</p>
        </div>
      </div>
    ))}
  </div>
)}
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