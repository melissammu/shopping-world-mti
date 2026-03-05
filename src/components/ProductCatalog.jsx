import React from "react";
import "../pages/productCatalogPage.css";

export default function ProductCatalog({ products = [] }) {

  if (!products.length) {
    return (
      <p style={{ opacity: 0.8, textAlign: "center", marginTop: "20px" }}>
        Aún no hay productos para mostrar.
      </p>
    );
  }

  return (

    <div className="catalog-container">

      {products.map((p, index) => (

        <div className="product-card" key={index}>

          <img
            src={p.image}
            alt={p.name}
            className="product-image"
          />

          <h3>{p.name}</h3>

          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="buy-button"
          >
            Comprar
          </a>

        </div>

      ))}

    </div>

  );
}