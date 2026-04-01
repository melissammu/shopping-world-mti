import React, { useEffect, useState } from "react";
import "./ProductCatalog.css";

export default function ProductCatalog({
  products = [],
  onProductClick,
  selectedProductId,
}) {
  const [search, setSearch] = useState("");

  const handleShare = async (product, e) => {
    e.stopPropagation();
   const store = product.store?.toLowerCase()?.trim();

let storeSlug = "amazon";

if (store?.includes("shein")) {
  storeSlug = "shein";
} else if (store?.includes("shopee")) {
  storeSlug = "shopee";
} else if (store === "amazon") {
  storeSlug = "amazon";
} else if (store?.includes("mercado")) {
  storeSlug = "mercadoli";
}
console.log("STORE ORIGINAL:", product.store);
console.log("STORE NORMALIZADA:", store);
console.log("STORE SLUG:", storeSlug);

const shareLink = `${window.location.origin}/s/${storeSlug}/${product.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name || "Produto",
          text: product.price
            ? `${product.name} - ${product.price}`
            : product.name || "Produto",
          url: shareLink,
        });
      } else {
        await navigator.clipboard.writeText(shareLink);
        alert("Link do produto copiado com sucesso.");
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  useEffect(() => {
    if (!selectedProductId) return;

    const selectedElement = document.querySelector(
      `[data-product-id="${selectedProductId}"]`
    );

    if (selectedElement) {
      selectedElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedProductId, products]);

  const filteredProducts = products.filter((product) => {
    const texto = `
      ${product.name || ""}
      ${product.category || ""}
      ${product.store || ""}
    `.toLowerCase();

    return texto.includes(search.toLowerCase());
  });

  const handleBuy = (product, e) => {
    e.stopPropagation();
    if (onProductClick) {
      onProductClick(product);
    }
  };

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <h2 className="catalog-title">Produtos</h2>
        <p className="catalog-subtitle">
          Escolha seu produto e clique para comprar
        </p>

        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="catalog-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const safeImage =
              product.image ||
              product.image_url ||
              "/produtos/placeholder-shein.jpg";

            return (
              <div
                key={product.id}
                data-product-id={product.id}
                className={`product-card ${
                  selectedProductId === product.id ? "highlight-product" : ""
                }`}
              >
               <img
  src={safeImage}
  alt={product.name}
  className="product-image"
  onClick={(e) => handleBuy(product, e)}
  onError={(e) => {
    e.currentTarget.src = "/produtos/placeholder-shein.jpg";
  }}
  style={{ cursor: "pointer" }}
/>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{product.price}</p>

                  <button
                    className="buy-button"
                    onClick={(e) => handleBuy(product, e)}
                  >
                    comprar agora
                  </button>

                  <button
                    className="share-button"
                    onClick={(e) => handleShare(product, e)}
                  >
                    Compartir
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>
            nenhum produto encontrado.
          </p>
        )}
      </div>
    </div>
  );
}