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
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="image-container">
              {product.price && (
                <span className="promo-message">{product.price}</span>
              )}

              <span className="click-watermark">👆 CLIQUE</span>

              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="product-image"
                />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}