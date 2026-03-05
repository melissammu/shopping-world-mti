import React from "react";
import ProductCatalog from "../components/ProductCatalog";
import { amazonProducts } from "../data/amazonProducts";

function AmazonPage() {
  return (
    <div>
      <ProductCatalog products={amazonProducts} />
    </div>
  );
}

export default AmazonPage;