import React, { useEffect, useState } from "react";
import ProductCatalog from "../components/ProductCatalog";
import { supabase } from "../lib/supabase";
import { registerAfiliateClick } from "../lib/registerAfiliateClick";

export default function SheinPage() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleAffiliateRedirect = async (product) => {
    const safeLink =
      (product.link_br && String(product.link_br).trim()) ||
      (product.link && String(product.link).trim()) ||
      "";

    if (!safeLink) {
      console.log("Producto Shein sin link válido");
      return;
    }

    try {
      await registerAfiliateClick(product);
      window.open(safeLink, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error en redirect Shein:", error);
      window.open(safeLink, "_blank", "noopener,noreferrer");
    }
  };

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });

      console.log("SHEIN DATA:", data);
      console.log("SHEIN ERROR:", error);

      if (error) {
        console.error("Erro ao buscar produtos Mercado Livre:", error);
        setErrorMessage(error.message);
        return;
      }

      const formattedProducts = (data || []).map((p) => {
        const finalLink =
          (p.link_br && String(p.link_br).trim()) ||
          (p.link && String(p.link).trim()) ||
          "";

        const finalImage =
          (p.image_url && String(p.image_url).trim()) ||
          (p.image && String(p.image).trim()) ||
          "/produtos/placeholder-shein.png";

        return {
          id: p.id,
          name: p.title || p.name || "Produto sem nome",
          price: p.price || "",
          image: finalImage,
          image_url: finalImage,
          link: finalLink,
          link_br: finalLink,
          category: p.category || p.categoria || "Sem categoria",
          store: p.store || "shein",
          is_creative: p.is_creative ?? false,
          country: "BR",
          catalogPath: "/shein", 
        };
      });

      console.log("FORMATADOS:", formattedProducts);
     
      setProducts(formattedProducts);
      const params = new URLSearchParams(window.location.search);
const productId = params.get("product");

if (productId) {
  setSelectedProductId(productId);
}
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

      <ProductCatalog
        products={products}
        onProductClick={handleAffiliateRedirect}
      />
    </div>
  );
}