import React, { useEffect, useState } from "react";
import ProductCatalog from "../components/ProductCatalog";
import { supabase } from "../lib/supabase";

export default function SheinPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Erro ao buscar produtos:", error);
        return;
      }

      setProducts(data || []);
    }

    loadProducts();
  }, []);

  return <ProductCatalog products={products} />;
}