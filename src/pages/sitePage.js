import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./sitePage.css";
import MainHeader from "../components/MainHeader";
import { useNavigate } from "react-router-dom";
import ProductCatalog from "../components/ProductCatalog";

export default function SitePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

 const normalizeText = (text) =>
  (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
const productsByCategory =
  activeCategory === "Todos"
    ? allProducts
    : allProducts.filter((product) =>
        normalizeText(product.category || "").includes(
          normalizeText(activeCategory)
        )
      );
  useEffect(() => {
    async function loadProducts() {
      
      const { data: sheinData, error: sheinError } = await supabase
        .from("products")
        .select("*")
        .eq("store", "shein");

         const { data: shopeeData, error: shopeeError } = await supabase
        .from("shopee")
        .select("*")
        .eq("is_active", true);

      const { data: amazonData, error: amazonError } = await supabase
        .from("amazon_products")
        .select("*")
        .eq("is_active", true);

      const { data: mercadoData, error: mercadoError } = await supabase
        .from("mercado_livre_br")
        .select("*");
 
      if (sheinError) {
        console.error("Erro ao buscar Shein:", sheinError);
      }

       if (shopeeError) {
        console.error("Erro ao buscar Shopee:", shopeeError);
      }

      if (amazonError) {
        console.error("Erro ao buscar Amazon:", amazonError);
      }

      if (mercadoError) {
        console.error("Erro ao buscar Mercado Livre:", mercadoError);
      }
      

      const sheinFormatted = (sheinData || []).map((p) => ( {
          
        id: `shein-${p.id}`,
        title: p.title || p.name || "Produto sem nome",
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

     const shopeeFormatted = (shopeeData || []).map((p) => ( {
          
        id: `shopee-${p.id}`,
        title: p.title || p.name || "Produto sem nome",
        price: p.price || "",
        image:
          (p.image_url && p.image_url.trim()) ||
          (typeof p.image === "string" && p.image.trim()) ||
          "/produtos/placeholder-shopee.png",
        link:
          (p.link_br && p.link_br.trim()) ||
          (p.link_us && p.link_us.trim()) ||
          (p.link && p.link.trim()) ||
          "",
        store: "Shopee",
        category: p.category || "Moda",
        country: "BR",
         catalogPath:"/shopee",

      }));
      const amazonFormatted = (amazonData || []).map((p) => ( {
          
        id: `amazon-${p.id}`,
        title: p.title || p.name || "Produto sem nome",
        price: p.price || "",
        image:
          (p.image_url && p.image_url.trim()) ||
          (typeof p.image === "string" && p.image.trim()) ||
          "/produtos/placeholder-amazon.jpg",
        link:
          (p.link_br && p.link_br.trim()) ||
          (p.link_us && p.link_us.trim()) ||
          (p.link && p.link.trim()) ||
          "",
        store: "Amazon",
        category: p.category || "Moda",
        country: "BR",
         catalogPath:"/amazon",

      }));
      
      const mercadoLiFormatted = (mercadoData || []).map((p) => ({
        id: `mercado-${p.id}`,
        title: p.title || p.name || "Produto sem nome",
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
const intercalarDeDos = (...listas) => {
  const resultado = [];
  let i = 0;
  let hay = true;

  while (hay) {
    hay = false;

    listas.forEach((lista) => {
      const grupo = lista.slice(i, i + 2);

      if (grupo.length > 0) {
        resultado.push(...grupo);
        hay = true;
      }
    });

    i += 2;
  }

  return resultado;
};

const mixedProducts = intercalarDeDos(
  sheinFormatted,
  shopeeFormatted,
  amazonFormatted,
  mercadoLiFormatted
);

setAllProducts(mixedProducts);
setFilteredProducts(mixedProducts); }

    loadProducts();
  }, []);
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  const productId = params.get("product");

  if (ref && !localStorage.getItem("affiliate_ref")) {
    localStorage.setItem("affiliate_ref", ref);
    console.log("REF guardado en HOME:", ref);
  }

  if (productId && allProducts.length > 0) {
    const foundProduct = allProducts.find(
      (product) => String(product.id) === String(productId)
    );

   if (foundProduct) {
  const restProducts = allProducts.filter(
    (product) => String(product.id) !== String(productId)
  );

  setFilteredProducts([foundProduct, ...restProducts]);
 }
  }
}, [allProducts]);

useEffect(() => {
  const term = normalizeText(search);

  if (!term) {
    setFilteredProducts(allProducts);
    return;
  }

  const results = allProducts.filter((product) => {
    const productName = normalizeText(product.title || "");
    const productCategory = normalizeText(product.category || "");
    const productStore = normalizeText(product.store || "");

    return (
      productName.includes(term) ||
      productCategory.includes(term) ||
      productStore.includes(term)
    );
  });

  setFilteredProducts(results.slice(0, 30));
}, [search, allProducts]);

const params = new URLSearchParams(window.location.search);
const productId = params.get("product");
const handleAffiliateRedirect = async (product) => {
  if (!product.link) {
    alert("Produto sem link de afiliado");
    return;
  }

  try {
    window.location.href = product.link;
  } catch (error) {
    console.error("Erro ao redirecionar:", error);
    window.location.href = product.link;
  }
};
useEffect(() => {
  const term = normalizeText(search);

  if (!term) {
    setFilteredProducts(allProducts);
    return;
  }

  const results = allProducts.filter((product) => {
    const productName = normalizeText(product.title || "");
    const productCategory = normalizeText(product.category || "");
    const productStore = normalizeText(product.store || "");

    return (
      productName.includes(term) ||
      productCategory.includes(term) ||
      productStore.includes(term)
    );
  });

  setFilteredProducts(results.slice(0, 30));
}, [search, allProducts]);

  const getPlaceholderByProduct = (product) => {
    if (product.store === "Shopee") {
      
      return "/produtos/placeholder-shopee.png";
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
      <p className="subtitle">Seu shopping global num só lugar.</p>
      
      <div className="card">
        <div
 className="category-section">
  <h2>Categorias</h2>
  <div
   className="category-header">
    {["Todos", "Moda", "Beleza", "Casa", "Eletrônicos", "Tendencia","Ofertas"].map((cat) => (
      <button
        key={cat}
        className={activeCategory === cat ? "active" : ""}
        onClick={() => setActiveCategory(cat)}
      >
        {cat}
      </button>
    ))}
  </div>
  
  <div className="home-container">

    {/* otras cosas (header, banner, etc) */}

    <ProductCatalog
      products={filteredProducts}
      onProductClick={handleAffiliateRedirect}
      selectedProductId={productId}
    />

  </div>
);

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
   {search ? (
  <div className="mixed-products">
    {filteredProducts.length === 0 ? (
      <p className="no-results">Nenhum produto encontrado</p>
    ) : (
      filteredProducts.map((product) => (
        <div
          className="product-card"
          key={`${product.store}-${product.id}`}
        >
          <span className="store">{product.store}</span>

          <div className="image-box">
            <img
              src={product.image_url || product.image}
              alt={product.title}
              onError={(e) => {
                e.currentTarget.src = getPlaceholderByProduct(product);
              }}
            />
          </div>

          <h3>{product.title}</h3>
          <p className="price">R$ {product.price}</p>

          <button
            onClick={() =>
              (window.location.href =
                product.link_br || product.link)
            }
          >
            Comprar agora
          </button>

          <button
            className="share-button"
            onClick={(e) => {
              e.stopPropagation();
              const link = `${window.location.origin}/?product=${product.id}`;
              navigator.clipboard.writeText(link);
              alert("Link copiado");
            }}
          >
            Compartir
          </button>
        </div>
      ))
    )}
  </div>

) : (
  <div className="mixed-products">
    {productsByCategory.map((product) => (
      <div
        className="product-card"
        key={`${product.store}-${product.id}`}
      >
        <span className="store">{product.store}</span>

        <div className="image-box">
          <img
            src={product.image_url || product.image}
            alt={product.title}
          />
        </div>

        <h3>{product.title}</h3>
        <p className="price">R$ {product.price}</p>

        <button
          onClick={() =>
            (window.location.href =
              product.link_br || product.link)
          }
        >
          Comprar agora
        </button>

        <button
          className="share-button"
          onClick={(e) => {
            e.stopPropagation();
            const link = `${window.location.origin}/?product=${product.id}`;
            navigator.clipboard.writeText(link);
            alert("Link copiado");
          }}
        >
          Compartir
        </button>
      </div>
    ))}
    </div>
)}
  </div>
  </div>
  </div>
  </div>
  );
  }
