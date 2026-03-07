import React, { useEffect, useState } from "react";
import ProductCatalog from "../components/ProductCatalog";
import { supabase } from "../lib/supabase";

export default function AmazonPage() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("amazon_products")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Erro ao buscar produtos Amazon:", error);
        setErrorMessage(error.message);
        return;
      }

      setProducts(data || []);
    }

    loadProducts();
  }, []);

  return (
    <div>
      {errorMessage && (
        <div style={{ padding: "10px", color: "red" }}>
          Erro: {errorMessage}
        </div>
      )}

      <ProductCatalog products={products} />
    </div>
  );
}