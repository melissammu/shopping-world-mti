import React, { useEffect, useState } from "react";
import ProductCatalog from "../components/ProductCatalog.jsx";
import { supabase } from "../lib/supabase";

export default function SheinPage() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Erro ao buscar produtos:", error);
        setErrorMessage(error.message);
        return;
      }

      setProducts(data || []);
    
    }

    loadProducts();
  }, []);

  return (
    <div>
      <div style={{ padding: "10px", fontSize: "18px" }}>
        Produtos carregados: {products.length}
      </div>

      {errorMessage && (
        <div style={{ padding: "10px", color: "red" }}>
          Erro: {errorMessage}
        </div>
      )}

      <ProductCatalog products={products} />
    </div>
  );
}