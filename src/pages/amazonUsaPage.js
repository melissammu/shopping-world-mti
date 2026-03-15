import React, { useEffect, useState } from "react";
import ProductCatalog from "../components/ProductCatalog";
import { supabase } from "../lib/supabase";

export default function AmazonUsaPage() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
async function loadProducts() {
  const { data, error } = await supabase
    .from("amazon_usa_products")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Erro ao buscar produtos amazonUsa:", error);
    setErrorMessage(error.message);
    return;
  }

  const formattedProducts = (data || [])
    .map((p) => {
      const finalLink =
        (p.link_br && p.link_br.trim()) ||
        (p.link_us && p.link_us.trim()) ||
        (p.link && p.link.trim()) ||
        "";

      const finalImage =
        (p.image_url && p.image_url.trim()) ||
        (p.image && typeof p.image === "string" && p.image.trim()) ||
        "/produtos/placeholder-amazonUsa.jpg";

      return {
        id: p.id,
        name: p.title || "producto",
        price: p.price || "",
        image: finalImage,
        image_url: finalImage,
        link: finalLink,
        category: p.category || "Sem categoria",
        store: p.store || "amazonUsa",
      };
    })
    .filter(Boolean);

  setProducts(formattedProducts);
}

    loadProducts();
  }, []);

  return (
    <div className="amazonUsa-page">
      {errorMessage && (
        <div style={{ padding: "10px", color: "red" }}>
          Erro: {errorMessage}
        </div>
      )}

      <ProductCatalog products={products} />
    </div>
  );
}