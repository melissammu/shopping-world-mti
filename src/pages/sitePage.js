import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./sitePage.css";
import MainHeader from "../components/MainHeader";
import { Link, useNavigate } from "react-router-dom";

export default function SitePage() {
  const [search, setSearch] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

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
        originalId: p.id,
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
        catalogPath: "/shein",
      }));

      const amazonFormatted = (amazonData || []).map((p) => {
        const isAmazonBr = p.link_br && p.link_br.trim();
        const isAmazonUs = p.link_us && p.link_us.trim();

        return {
          id: `amazon-${p.id}`,
          originalId: p.id,
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
          catalogPath: isAmazonBr
            ? "/amazon"
            : isAmazonUs
            ? "/amazonusa"
            : "/amazon",
        };
      });

      const mercadoFormatted = (mercadoData || []).map((p) => ({
        id: `mercado-${p.id}`,
        originalId: p.id,
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
        store: "Mercado br",
        category: p.category || "Geral",
        country: "BR",
        catalogPath: "/mercadoLi",
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

    const results = allProducts.filter(
      (product) =>
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

    if (product.store === "Mercado br") {
      return "/produtos/placeholder-mercadoLi.png";
    }

    return "/produtos/placeholder-shein.jpg";
  };

  const registerClick = async (product) => {
    try {
      const codigo_ref = localStorage.getItem("affiliate_ref") || "sin-ref";
      const productId = String(product.originalId || product.id);

      // 1. Guardar historial completo
      const { error: clickError } = await supabase.from("clicks").insert([
        {
          codigo_ref: codigo_ref,
          product_id: productId,
          product_name: product.name || "Producto sin nombre",
          store: product.store || "unknown",
          country: product.country || "BR",
        },
      ]);

      if (clickError) {
        console.error("ERROR insert clicks:", clickError);
        return false;
      }

      // 2. Buscar si ya existe en resumen
      const { data: existing, error: selectError } = await supabase
        .from("clicks_resumen")
        .select("*")
        .eq("codigo_ref", codigo_ref)
        .eq("product_id", productId)
        .maybeSingle();

      if (selectError) {
        console.error("ERROR select clicks_resumen:", selectError);
        return false;
      }

      // 3. Actualizar o insertar resumen
      if (existing) {
        const { error: updateError } = await supabase
          .from("clicks_resumen")
          .update({
            total_clicks: Number(existing.total_clicks || 0) + 1,
            updated_at: new Date().toISOString(),
            country: product.country || "BR",
          })
          .eq("id", existing.id);

        if (updateError) {
          console.error("ERROR update clicks_resumen:", updateError);
          return false;
        }
      } else {
        const { error: insertResumenError } = await supabase
          .from("clicks_resumen")
          .insert([
            {
              codigo_ref: codigo_ref,
              product_id: productId,
              product_name: product.name || "Producto sin nombre",
              store: product.store || "unknown",
              total_clicks: 1,
              country: product.country || "BR",
            },
          ]);

        if (insertResumenError) {
          console.error(
            "ERROR insert clicks_resumen:",
            insertResumenError
          );
          return false;
        }
      }

      console.log("CLICK REGISTRADO OK");
      return true;
    } catch (error) {
      console.error("ERROR GENERAL registerClick:", error);
      return false;
    }
  };

  return (
    <div className="home-container">
      <MainHeader />

      <img
        src="/avatar/shop_word3.png"
        alt="Shopping World"
        className="logo"
      />

      <h1 className="title">Shopping World MTI.</h1>
      <p className="subtitle">Seu shopping mundial num só lugar.</p>

      <div className="card">
        <div className="search-area">
          <div className="search-box">
            {!search && <span className="search-icon">🔍</span>}

            <input
              type="text"
              placeholder="Busca inteligente nas lojas..."
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
                    onClick={async () => {
                      if (!product.catalogPath) return;

                      const ok = await registerClick(product);

                      if (ok) {
                        navigate(product.catalogPath);
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

        <div className="stores-grid">
          <Link to="/shein" className="store-card shein-card">
            <span className="store-name">SHEIN</span>
            <span className="store-flag">BR</span>
          </Link>

          <Link to="/amazon" className="store-card amazon-card">
            <span className="store-name">Amazon Brasil</span>
            <span className="store-flag">BR</span>
          </Link>

          <Link to="/amazonusa" className="store-card amazonusa-card">
            <span className="store-name">Amazon USA</span>
            <span className="store-flag">US</span>
          </Link>

          <Link to="/mercadoLi" className="store-card mercado-card">
            <span className="store-name">Mercado Livre</span>
            <span className="store-flag">BR</span>
          </Link>
        </div>
      </div>
    </div>
  );
}