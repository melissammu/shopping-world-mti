import React, { useEffect, useState } from "react";
import ProductCatalog from "../components/ProductCatalog";
import { supabase } from "../lib/supabase";
import { registerAfiliateClick } from "../lib/registerAfiliateClick";

export default function MercadoLiPage() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleAffiliateRedirect = async (product) => {
  const safeLink =
    (product.link_br && String(product.link_br).trim()) ||
    (product.link && String(product.link).trim()) ||
    "";

  if (!safeLink) {
    console.log("Produto Amazon sem link válido");
    return;
  }

  try {
    await registerAfiliateClick(product);
    window.location.href = safeLink;
  } catch (error) {
    console.error("Erro ao redirecionar Amazon:", error);
    window.location.href = safeLink;
  }
};

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("mercado_livre_br")
        .select("*")
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
          (p.link && String(p.link).trim()) ||
          "";

        const finalImage =
          (p.image_url && String(p.image_url).trim()) ||
          (p.image && String(p.image).trim()) ||
          "/produtos/placeholder-mercadoLi.png";

        return {
  id: `mercado-${p.id}`,
  name: p.title || p.name || "Produto sem nome",
  price: p.price || "",
  image: finalImage,
  link: finalLink,
  store: "Mercado Livre",
  category: p.category || "Geral",
  country: "BR",
  catalogPath: "/mercadoLi",
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
    <div className="mercadoLi-page">
      {errorMessage && (
        <div style={{ padding: "10px", color: "red" }}>
          Erro: {errorMessage}
        </div>
      )}
<div style={{
    display: "flex",
    alignItems: "center",
    gap: "6px", // espacio entre nombre y logo
    background: "#fff",
    padding: "4px 8px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
  }}>

    {/* Nombre tienda */}
    <span style={{
      fontWeight: "600",
      fontSize: "20px",
      color: "#fde803"
    }}>
  Mercado livre
    </span>

    {/* Logo MTI */}
    <img
      src="/avatar/icono2-512.png"
      alt="MTI"
      style={{
        width: "30px",
        height: "30px",
        objectFit: "contain"
      }}
    />

  </div>

      <ProductCatalog
        products={products}
        onProductClick={handleAffiliateRedirect}
        selectedProductId={selectedProductId}
      />
    </div>
  );
}