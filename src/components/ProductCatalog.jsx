import React from "react";
import "./ProductCatalog.css";

export default function ProductCatalog({ products = [] }) {
  return (
    <div className="product-catalog-page">
      <h2>Produtos</h2>
      <p>Escolha seu produto e clique para comprar</p>

      <div className="product-grid">
        {products.map((product) => {
          const safeLink =
            product.link &&
            product.link.trim() !== "" &&
            product.link !== "#"
              ? product.link.trim()
              : "";

          const safeImage =
            Array.isArray(product.image) && product.image.length > 0
              ? product.image[0]
              : "/produtos/placeholder-amazon.jpg";

          return (
            <div key={product.id} className="product-card">
              {safeLink ? (
                <a
                  href={safeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={safeImage}
                    alt={product.name || "Produto"}
                    className="product-image"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/produtos/placeholder-amazon.jpg";
                    }}
                  />
                </a>
              ) : (
                <img
                  src={safeImage}
                  alt={product.name || "Produto"}
                  className="product-image"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/produtos/placeholder-amazon.jpg";
                  }}
                />
              )}

              {safeLink ? (
                <a
                  href={safeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-title-link"
                >
                  <h3>{product.name}</h3>
                </a>
              ) : (
                <h3>{product.name}</h3>
              )}

              <p>{product.price}</p>

              {safeLink ? (
                <a
                  href={safeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-button"
                  style={{ display: "inline-block", textDecoration: "none" }}
                >
                  🔥 Clique
                </a>
              ) : (
                <button type="button" className="product-button" disabled>
                  Sem link
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}