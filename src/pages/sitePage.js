import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./sitePage.css";
import MainHeader from "../components/MainHeader";
import {Link, useNavigate} from "react-router-dom";
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
         catalogPath:"/shein",

      }));
      <>
</>
      const amazonFormatted = (amazonData || []).map((p) => {
        const isAmazonBr = p.link_br && p.link_br.trim();
        const isAmazonUs = p.link_us && p.link_us.trim();

        return  {
          
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
         catalogPath: isAmazonBr ? "/amazon" : isAmazonUs ? "/amazonusa" : "/amazon",
        
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
        store: "Mercado br",
        category: p.category || "Geral",
        country: "BR",
         catalogPath:"/mercadoLi",

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

    if (product.store === "Mercado br") {
      return "/produtos/placeholder-mercadoLi.png";
    }

    return "/produtos/placeholder-shein.jpg";
  };

    const registerClick = async (product) => {
  try {
    const codigo_ref = localStorage.getItem("affiliate_ref") || "sin-ref";
    const productId = String(product.id);

    // 🔥 1. GUARDAR CLICK NORMAL
    await supabase.from("clicks").insert([
      {
        codigo_ref: codigo_ref,
        product_id: productId,
        product_name: product.name || "Producto sin nombre",
        store: product.store || "unknown",
        country: product.country || "BR"
      }
    ]);

    // 🔥 2. BUSCAR SI YA EXISTE EN RESUMEN
    const { data: existing } = await supabase
      .from("clicks_resumen")
      .select("*")
      .eq("codigo_ref",codigo_ref)
      .eq("product_id", productId)
      .maybeSingle();

    if (existing) {
      // 🔥 ACTUALIZA (SUMA +1)
      await supabase
        .from("clicks_resumen")
        .update({
          total_clicks: existing.total_clicks + 1,
          updated_at: new Date(),
          country: product.country || "BR"
        })
        .eq("id", existing.id);

    } else {
      // 🔥 CREA NUEVO REGISTRO
      await supabase
        .from("clicks_resumen")
        .insert([
          {
           codigo_ref:codigo_ref,
            product_id: productId,
            product_name: product.name || "Producto sin nombre",
            store: product.store || "unknown",
            total_clicks: 1,
            country: product.country || "BR"
          }
        ]);
    }

    return true;

  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};
return ( 
    <div className="home-container">
      <MainHeader/>
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

  await registerClick(product);
  navigate(product.catalogPath);
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
  <Link to="/shein" className="store shein">
    <span>SHEIN</span>
    <span className="flag">BR</span>
  </Link>

  <Link to="/amazon" className="store amazon-br">
    <span>Amazon Brasil</span>
    <span className="flag">BR</span>
  </Link>

  <Link to="/amazonusa" className="store amazon-us">
    <span>Amazon USA</span>
    <span className="flag">US</span>
  </Link>

  <Link to="/mercadoli" className="store mercado">
    <span>Mercado Livre</span>
    <span className="flag">BR</span>
  </Link>
</div>
      </div>
    </div>
  );
}