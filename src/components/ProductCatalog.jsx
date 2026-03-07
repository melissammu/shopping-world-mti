import React from "react";
import "./ProductCatalog.css";

export default function ProductCatalog({ products = [] }) {
  const buildProxyImage = (imageUrl) => {
    if (!imageUrl) return "/produtos/placeholder.jpg";

    if (
      imageUrl.startsWith("/produtos/") ||
      imageUrl.startsWith("/images/") ||
      imageUrl.startsWith("data:")
    ) {
      return imageUrl;
    }

    return `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
  };

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <h1 className="catalog-title">Produtos</h1>
        <p className="catalog-subtitle">
          Escolha seu produto e clique para comprar
        </p>
      </div>

      <div className="catalog-grid">
        {products.map((product) => (
          <a
            key={product.id}
            href={product.link}
            target="_blank"
            rel="noreferrer"
            className="product-card"
          >
            <div className="image-container">
              {product.tag && (
                <span className="promo-message">{product.tag}</span>
              )}

              <img
                src={buildProxyImage(product.image)}
                alt={product.name || product.title || "Produto"}
                className="product-image"
                loading="lazy"
                onError={(e) => {
                  const img = product.image || "";
                  const store = product.store || "";

                  if (
                    store === "amazon" ||
                    img.includes("amazon") ||
                    img.includes("m.media-amazon") ||
                    img.includes("amazonaws")
                  ) {
                    e.currentTarget.src = "/produtos/placeholder-amazon.jpg";
                  } else {
                    e.currentTarget.src = "/produtos/placeholder.jpg";
                  }
                }}
              />

              <span className="click-watermark">🔥 Clique</span>
            </div>

            <div className="product-info">
              <h3 className="product-name">
                {product.name || product.title || "Produto"}
              </h3>
              <p className="product-price">{product.price || ""}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}