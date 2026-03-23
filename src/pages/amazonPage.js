import React, { useEffect, useState } from "react";
import ProductCatalog from "../components/ProductCatalog";
import { supabase } from "../lib/supabase";
import { registerAfiliateClick } from "../lib/registerAfiliateClick";

export default function AmazonPage() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAffiliateRedirect = async (product) => {
    const safeLink =
      (product.link_br && String(product.link_br).trim()) ||
      (product.link && String(product.link).trim()) ||
      "";

    if (!safeLink) {
      console.log("Producto Amazon sin link válido");
      return;
    }

    try {
      await registerAfiliateClick(product);
      window.open(safeLink, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error en redirect Amazon:", error);
      window.open(safeLink, "_blank", "noopener,noreferrer");
    }
  };

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("amazon_products")
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
            (p.link_br && String(p.link_br).trim()) ||
            (p.link && String(p.link).trim()) ||
            "";

          if (!finalLink) {
            return null;
          }

          const finalImage =
            (p.image_url && String(p.image_url).trim()) ||
            (p.image && String(p.image).trim()) ||
            "/produtos/placeholder-amazon.png";

          return {
            id: p.id,
            name: p.title || p.name || "Produto sem nome",
            price: p.price || "",
            image: finalImage,
            image_url: finalImage,
            link: finalLink,
            link_br: finalLink,
            category: p.category || p.categoria || "Sem categoria",
            store: "Amazon",
            country: "BR",
          };
        })
        .filter(Boolean);

      setProducts(formattedProducts);
    }

    loadProducts();
  }, []);

  return (
    <div className="amazon-page">
      {errorMessage && (
        <div style={{ padding: "10px", color: "red" }}>
          Erro: {errorMessage}
        </div>
      )}

      <ProductCatalog
        products={products}
        onProductClick={handleAffiliateRedirect}
      />
    </div>
  );
}