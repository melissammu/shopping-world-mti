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
        country: "GLOBAL",
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
        country: p.link_br && p.link_br.trim() ? "BR" : "US",
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

  const getStoreLabel = (product) => {
    if (product.store === "Shein" && product.country === "GLOBAL") {
      return "🖤 Shein 🌎";
    }

    if (product.store === "Amazon" && product.country === "BR") {
      return "🟧 Amazon 🇧🇷";
    }

    if (product.store === "Amazon" && product.country === "US") {
      return "🟧 Amazon 🇺🇸";
    }

    return product.store;
  };

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

      <div className="home-layout">
        {/* COLUMNA IZQUIERDA */}
        <div className="search-column">
          <div className="global-search">
            <input
              type="text"
              placeholder="Buscar produto em todas as lojas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="global-search-input"
            />
          </div>

          {search && (
            <div className="global-search-results">
              {filteredProducts.length === 0 ? (
                <p style={{ padding: "10px" }}>Nenhum produto encontrado</p>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="global-search-item"
                    onClick={() => {
                      if (product.link) {
                        window.open(product.link, "_blank");
                      }
                    }}
                  >
                    <img
                      src={product.image || "/produtos/placeholder-amazon.png"}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src =
                          product.store === "Amazon"
                            ? "/produtos/placeholder-amazon.png"
                            : "/produtos/placeholder-shein.jpg";
                      }}
                    />

                    <div className="global-search-info">
                      <p className="global-search-name">{product.name}</p>
                      <p className="global-search-store">{getStoreLabel(product)}</p>
                      <p className="global-search-price">{product.price}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA */}
        <div className="store-column">
          <Link to="/shein" className="store-button shein-br-btn">
            Shein 🇧🇷
          </Link>

          <a href="#" className="store-button shein-ve-btn">
            Shein 🇻🇪
          </a>

          <Link to="/amazon" className="store-button amazon-br-btn">
            Amazon 🇧🇷
          </Link>

          <a href="#" className="store-button amazon-us-btn">
            Amazon 🇺🇸
          </a>

          <a href="#" className="store-button mercado-btn">
            Mercado Livre 🇧🇷
          </a>

          <a
            href={tiktokShopLink}
            target="_blank"
            rel="noreferrer"
            className="store-button tiktok-btn"
          >
            TikTok Shop
          </a>

        </div>
      </div>
    </div>

  </div>
);
 }