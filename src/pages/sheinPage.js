import React, { useEffect, useState } from "react";
import ProductCatalog from "../components/ProductCatalog";
import { supabase } from "../lib/supabase";

export default function SheinPage() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("id", { ascending: false });

      if (error) {
        console.error("Erro ao buscar produtos Amazon:", error);
        setErrorMessage(error.message);
        return;
      }

      const formattedProducts = (data || [])
        .map((p) => {
          const finalLink =
            (p.link_br && p.link_br.trim()) ||
            (p.link_us && p.link_us.trim()) ||
            "";

          if (!finalLink) {
            return null;
          }

          const finalImage =
            (p.image_url && p.image_url.trim()) ||
            "/produtos/placeholder-shein.jpg";

          return {
            id: p.id,
            name: p.title || "Produto sem nome",
            price: p.price || "",
            image: [finalImage],
            link: finalLink,
            category: p.category || "Sem categoria",
          };
        })
        .filter(Boolean);

      setProducts(formattedProducts);
    }

    loadProducts();
  }, []);

  return (
    <div className="shein-page">
      {errorMessage && (
        <div style={{ padding: "10px", color: "red" }}>
          Erro: {errorMessage}
        </div>
      )}

      <ProductCatalog products={products} />
    </div>
  );
}