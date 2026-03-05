import React from "react";
import ProductCatalog from "../components/ProductCatalog";
import sheinProducts from "../data/sheinProducts";

export default function SheinPage() {
  return (
    <div>
      <ProductCatalog products={sheinProducts} />
    </div>
  );
}