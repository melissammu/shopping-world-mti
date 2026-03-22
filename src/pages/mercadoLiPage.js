import React, { useEffect, useState } from "react";
import ProductCatalog from "../components/ProductCatalog";
import { supabase } from "../lib/supabase";

export default function MercadoLiPage() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("mercado-livre-br")
        .select("*")
        .eq("store", "mercado.br")
        .order("id", { ascending: false });

      console.log("MERCADO LIVRE DATA:", data);
      console.log("MERCADO LIVRE ERROR:", error);

      if (error) {
        console.error("Erro ao buscar produtos Mercado Livre:", error);
        setErrorMessage(error.message);
        return;
      }

      const formattedProducts = (data || []).map((p) => {
        const finalLink =
          (p.link_br && String(p.link_br).trim()) ||
          (p.link_us && String(p.link_us).trim()) ||
          (p.link && String(p.link).trim()) ||
          "";

        const finalImage =
          (p.image_url && String(p.image_url).trim()) ||
          (p.image && String(p.image).trim()) ||
          "/produtos/placeholder-mercadoli.jpg";

        return {
          id: p.id,
          name: p.title || p.name || "Produto sem nome",
          price: p.price || "",
          image: finalImage,
          image_url: finalImage,
          link: finalLink,
          category: p.category || "Sem categoria",
          store: p.store || "mercado.br",
          is_creative: p.is_creative ?? false,
        };
      });

      setProducts(formattedProducts);
    }

    loadProducts();
  }, []);

  return (
    <div className="mercadoLi-page">
      {errorMessage && (
        <div style={{ padding: "10px", color: "red" }}>
          Erro: {errorMessage}
        </div>
      )}

      <ProductCatalog products={products} />
    </div>
  );
}