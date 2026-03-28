import React, { useState } from "react";
import "./ProductCatalog.css";

export default function ProductCatalog({ products = [], onProductClick }) {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) => {
    const texto = `
      ${product.name || ""}
      ${product.category || ""}
      ${product.store || ""}
    `.toLowerCase();

    return texto.includes(search.toLowerCase());
  });
const handleClick = async (product) => {
  try {
    console.log("CLICK EN PRODUCT:", product);

    if (onProductClick) {
      await onProductClick(product);
    }

  } catch (error) {
    console.error("Error general:", error);
  }
};
  return (
    <div className="catalog-page">
      <div className="catalog-Header">
        <h2 className="catalog-title">Produtos</h2>
        <p className="catalog-subtitle">
          Escolha seu produto e clique para comprar
        </p>

        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="catalog-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const safeLink =
              (product.link_br && product.link_br.trim()) ||
              (product.link_us && product.link_us.trim()) ||
              (product.link && product.link.trim()) ||
              "";

            const safeImage =
              (product.image_url && product.image_url.trim()) ||
              (product.image && product.image.trim()) ||
              "/produtos/placeholder-shein.jpg";

            return (
             <div
  key={product.id}
  className="product-card"
  
>
                
               <div
  className="image-container"
  onClick={() => handleClick(product)}
  style={{ cursor: "pointer" }}
>
                  <img
                    src={safeImage}
                    alt={product.name || "Produto"}
                    className="product-image"
                    onError={(e) => {
                      e.currentTarget.src = "/produtos/placeholder-shein.jpg";
                    }}
                  />

                </div>

                <div className="product-info">
                  <h3 className="product-name">
                    {product.name || "Produto sem nome"}
                  </h3>

                  <p className="product-price">{product.price || ""}</p>

                {safeLink ? (
  <>
    <button
      className="buy-button"
      onClick={async (e) => {
        e.stopPropagation();
        console.log("click en botón");
        await handleClick(product);
      }}
    >
      comprar agora
    </button>

    <button
      className="share-button"
      onClick={(e) => {
        e.stopPropagation();

        const link = `${window.location.origin}/product/${product.id}`;
        navigator.clipboard.writeText(link);
        alert("Link copiado");
      }}
    >
      Compartir
    </button>
  </>
) : (
  <>
    <button
      className="buy-button product-button disabled"
      disabled
    >
      sem link
    </button>

    <button
      className="share-button"
      onClick={(e) => {
        e.stopPropagation();

        const link = `${window.location.origin}/product/${product.id}`;
        navigator.clipboard.writeText(link);
        alert("Link copiado");
      }}
    >
      Compartir
    </button>
  </>
)}
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