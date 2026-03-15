import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./sitePages.css";

export default function SitePage() {
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

      const { data: mercadoData, error: mercadoError } = await supabase
        .from("products")
        .select("*")
        .eq("store", "mercadoLi");

      if (sheinError) {
        console.error("Erro ao buscar Shein:", sheinError);
      }

      if (amazonError) {
        console.error("Erro ao buscar Amazon:", amazonError);
      }

      if (mercadoError) {
        console.error("Erro ao buscar Mercado Livre:", mercadoError);
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
        category: p.category || "Moda",
        country: "BR",
      }));

      const amazonFormatted = (amazonData || []).map((p) => {
        const isAmazonBr = p.link_br && p.link_br.trim();
        const isAmazonUs = p.link_us && p.link_us.trim();

        return {
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
          category: p.category || "Geral",
          country: isAmazonBr ? "BR" : isAmazonUs ? "US" : "",
        };
      });

      const mercadoFormatted = (mercadoData || []).map((p) => ({
        id: `mercado-${p.id}`,
        name: p.title || p.name || "Produto sem nome",
        price: p.price || "",
        image:
          (p.image_url && p.image_url.trim()) ||
          (typeof p.image === "string" && p.image.trim()) ||
          "/produtos/placeholder-mercadoLi.png",
        link:
          (p.link_br && p.link_br.trim()) ||
          (p.link && p.link.trim()) ||
          "",
        store: "Mercado Livre",
        category: p.category || "Geral",
        country: "BR",
      }));

      setAllProducts([
        ...sheinFormatted,
        ...amazonFormatted,
        ...mercadoFormatted,
      ]);
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
      product.name?.toLowerCase().includes(term) ||
      product.category?.toLowerCase().includes(term) ||
      product.store?.toLowerCase().includes(term)
    );

    setFilteredProducts(results.slice(0, 8));
  }, [search, allProducts]);

  const getPlaceholderByProduct = (product) => {
    if (product.store === "Amazon" && product.country === "US") {
      return "/produtos/placeholder-amazonUsa.png";
    }

    if (product.store === "Amazon") {
      return "/produtos/placeholder-amazon.png";
    }

    if (product.store === "Mercado Livre") {
      return "/produtos/placeholder-mercadoLi.png";
    }

    return "/produtos/placeholder-shein.jpg";
  };

  return (
    <div className="home-container">
      <img
        src="/avatar/shop_word2.png"
        alt="Shopping World"
        className="logo"
      />

      <h1 className="title">Tudo mais facil.</h1>
      <p className="subtitle">Seu shopping mundial num só lugar.</p>

      <div className="card">
        <div className="search-area">
          <div className="search-box">
            {!search && <span className="search-icon">🔍</span>}

            <input
              type="text"
              placeholder="Busca inteligente..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {search && (
            <div className="global-search-results">
              {filteredProducts.length === 0 ? (
                <p className="no-results">Nenhum produto encontrado</p>
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
                      src={product.image}
                      alt={product.name}
                      className="global-search-image"
                      onError={(e) => {
                        e.currentTarget.src = getPlaceholderByProduct(product);
                      }}
                    />

                    <div className="global-search-info">
                      <p className="global-search-name">{product.name}</p>
                      <p className="global-search-store">
                        {product.store}
                        {product.country ? ` - ${product.country}` : ""}
                      </p>
                      <p className="global-search-price">{product.price}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="stores">
          <a href="/shein" className="store shein">
            <span>SHEIN</span>
            <span className="flag">BR</span>
          </a>

          <a href="/amazon" className="store amazon-br">
            <span>Amazon Brasil</span>
            <span className="flag">BR</span>
          </a>

          <a href="/amazonusa" className="store amazon-us">
            <span>Amazon USA</span>
            <span className="flag">US</span>
          </a>

          <a href="/mercadolivre" className="store mercado">
            <span>Mercado Livre</span>
            <span className="flag">BR</span>
          </a>
        </div>
      </div>
    </div>
  );
}