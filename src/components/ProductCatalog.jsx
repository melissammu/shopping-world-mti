import React from "react";
import "./ProductCatalog.css";

export default function ProductCatalog({ products = [] }) {
  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <h1 className="catalog-title">Produtos</h1>
        <p className="catalog-subtitle">
          Escolha seu produto e clique para comprar
        </p>
      </div>

      <div className="catalog-grid">
        {products.map((product) => {
          const imageSrc =
            Array.isArray(product.images) && product.images.length > 0
              ? product.images[0]
              : product.image || "";

          return (
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
                  src={imageSrc}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.currentTarget.src = "/produtos/placeholder.jpg";
                  }}
                />

                <span className="click-watermark">🔥 Clique</span>
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{product.price}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}