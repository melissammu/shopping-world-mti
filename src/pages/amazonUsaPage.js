import React, { useEffect, useState } from "react";
import ProductCatalog from "../components/ProductCatalog";
import { supabase } from "../lib/supabase";
import { registerAfiliateClick } from "../lib/registerAfiliateClick";

export default function AmazonUsaPage() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);  

  const handleAffiliateRedirect = async (product) => {
    const safeLink =
      (product.link_us && String(product.link_us).trim()) ||
      (product.link && String(product.link).trim()) ||
      (product.link_br && String(product.link_br).trim()) ||
      "";

    if (!safeLink) {
      alert("Este produto ainda não tem link disponível.");
      return;
    }

    try {
      await registerAfiliateClick(product);
      window.open(safeLink, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Erro en redirect Amazon USA:", error);
      window.open(safeLink, "_blank", "noopener,noreferrer");
    }
  };

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("amazon_usa_products")
        .select("*")
        .order("id", { ascending: false });

      console.log("AMAZON USA DATA:", data);

      if (error) {
        console.error("Erro ao buscar produtos amazonUsa:", error);
        setErrorMessage(error.message);
        return;
      }

      const formattedProducts = (data || []).map((p) => {
        const finalLink =
          (p.link_us && String(p.link_us).trim()) ||
          (p.link && String(p.link).trim()) ||
          (p.link_br && String(p.link_br).trim()) ||
          "";

        const finalImage =
          (p.image_url && String(p.image_url).trim()) ||
          (p.image && String(p.image).trim()) ||
          "/produtos/placeholder-amazonUsa.jpg";

       return {
  id: `amazonusa-${p.id}`,
  name: p.title2 || p.title || p.name || "Producto",
  price: p.price || "",
  image: finalImage,
  link: finalLink,
  link_us: p.link_us || "",
  store: "Amazon",
  category: p.category || p.categoria || "Sem categoria",
  country: "US",
  catalogPath: "/amazonusa",
};
      });

      console.log("AMAZON USA FORMATADOS:", formattedProducts);

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
    <div className="amazonUsa-page">
      {errorMessage && (
        <div style={{ padding: "10px", color: "red" }}>
          Erro: {errorMessage}
        </div>
      )}

      <div
        style={{
          background: "#fff3cd",
          color: "#856404",
          border: "1px solid #ffc69c",
          padding: "12px 14px",
          margin: "12px",
          borderRadius: "10px",
          fontSize: "14px",
          lineHeight: "1.4",
          textAlign: "left",
        }}
      >
        🇺🇸 Produtos disponíveis na Amazon USA. Compras indicadas para clientes
        nos Estados Unidos ou para quem utiliza casillero / redirecionamento
        internacional.
      </div>

      <ProductCatalog
              products={products}
              onProductClick={handleAffiliateRedirect}
              selectedProductId={selectedProductId}
            />
    </div>
  );
}