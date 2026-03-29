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

 const normalizeText = (text) =>
  (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
};
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
        .eq("store", "mercado_livre_br");

      if (sheinError) {
        console.error("Erro ao buscar Shein:", sheinError);
      }

      if (amazonError) {
        console.error("Erro ao buscar Amazon:", amazonError);
      }

      if (mercadoError) {
        console.error("Erro ao buscar Mercado Livre:", mercadoError);
      }

      const sheinFormatted = (sheinData || []).map((p) => ( {
          
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
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");

  if (ref && !localStorage.getItem("affiliate_ref")) {
    localStorage.setItem("affiliate_ref", ref);
    console.log("REF guardado en HOME:", ref);
  }
}, []);

 useEffect(() => {
  const term = normalizeText(search);

  if (!term) {
    setFilteredProducts([]);
    return;
  }

  const results = allProducts.filter((product) => {
    const productName = normalizeText(product.name);
    const productCategory = normalizeText(product.category);
    const productStore = normalizeText(product.store);

    return (
      productName.includes(term) ||
      productCategory.includes(term) ||
      productStore.includes(term)
    );
  });

  const mixedResults = shuffleArray(results);

  setFilteredProducts(mixedResults.slice(0, 20));
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

<button
  className="buy-button"
  onClick={(e) => {
    e.stopPropagation();

    if (!product.catalogPath) return;

    navigate(product.catalogPath);
  }}
>
  comprar agora
</button>

  <button
    className="share-button"
    onClick={(e) => {
  e.stopPropagation();

  const storeSlug =
    product.store === "Amazon"
      ? "amazonusa"
      : product.store === "Amazon"
      ? "amazon"
      : product.store === "Shein"
      ? "shein"
      : product.store === "Mercado br"
      ? "mercadoLi"
      : "produto";

  const link = `${window.location.origin}/s/${storeSlug}/${product.id}`;

  navigator.clipboard.writeText(link);
  alert("Link copiado");
}}
  >
    Compartir
  </button>
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