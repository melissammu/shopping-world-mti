import React from "react";
import ProductCatalog from "../components/ProductCatalog";
import amazonProducts from "../data/amazonProducts";

export default function AmazonPage() {
  return <ProductCatalog products={amazonProducts} />;
 }