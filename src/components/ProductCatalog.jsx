import React from "react";
import "./ProductCatalog.css";

export default function ProductCatalog({ products = [] }) {
  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <h2 className="catalog-title">Produtos</h2>
        <p className="catalog-subtitle">
          Escolha seu produto e clique para comprar
        </p>
      </div>

      <div className="catalog-grid">
        {products.map((product) => {
          const safeLink =
            (product.link_br &&
            product.link_br.trim())||
            (product.link_us &&
            product.link_us.trim())||
            (product.link &&
            product.link.trim())||
            "";

           const safeImage =
           (product.image_url && 
            product.image_url.trim()) ||
           (Array.isArray(product.image) ?
           product.image[0] : product.image) ||
            "/produtos/placeholder-shein.jpg";

          return (
            <div key={product.id} className="product-card">
              {safeLink ? (
                <a
                  href={safeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="image-container"
                >
                  <img
                    src={safeImage}
                    alt={product.name || "Produto"}
                    className="product-image"
                    onError={(e) => {
                      e.currentTarget.src = "/produtos/placeholder-amazon.jpg";
                    }}
                  />
                  <span className="click-shortcut">🔥 Clique</span>
                </a>
              ) : (
                <div className="image-container">
                  <img
                    src={safeImage}
                    alt={product.name || "Produto"}
                    className="product-image"
                    onError={(e) => {
                      e.currentTarget.src = "/produtos/placeholder-amazon.jpg";
                    }}
                  />
                </div>
              )}

              <div className="product-info">
                {safeLink ? (
                  <a
                    href={safeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="product-title-link"
                  >
                    <h3 className="product-name">{product.name}</h3>
                  </a>
                ) : (
                  <h3 className="product-name">{product.name}</h3>
                )}

                <p className="product-price">{product.price}</p>

                {safeLink ? (
                  <button
                  className="buy-button"
                  onClick={() => window.open(product.link, "_blank")}
                >               
                 Comprar agora
                 </button>
                ) : (
                  <button type="button" className="product-button" disabled>
                    Sem link
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}