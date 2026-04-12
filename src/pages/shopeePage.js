import React, { useEffect, useState } from "react";
import ProductCatalog from "../components/ProductCatalog";
import { supabase } from "../lib/supabase";
import { registerAfiliateClick } from "../lib/registerAfiliateClick";

export default function ShopeePage() {
  
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleAffiliateRedirect = async (product) => {
  const safeLink =
    (product.link_br && String(product.link_br).trim()) ||
    (product.link && String(product.link).trim()) ||
    "";

  if (!safeLink) {
    console.log("Produto shopee sem link válido");
    return;
  }

  try {
    await registerAfiliateClick(product);
    window.location.href = safeLink;
  } catch (error) {
    console.error("Erro ao redirecionar Shopee:", error);
    window.location.href = safeLink;
  }
};

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("shopee")
        .select("*")
        .order("id", { ascending: false });

      console.log("SHOPEE DATA:", data);
      console.log("SHOPEE ERROR:", error);

      if (error) {
        console.error("Erro ao buscar produtos Shopee:", error);
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
          "/produtos/placeholder-shopee.png";

        return {
  id: `shopee-${p.id}`,
  title: p.title || p.name || "Produto sem nome",
  price: p.price || "",
  image: finalImage,
  link: finalLink,
  store: "Shopee",
  category: p.category || "Moda",
  country: "BR",
  catalogPath: "/shopee",
};
      });

      console.log("FORMATADOS:", formattedProducts);
     
      setProducts(formattedProducts);
      const params = new URLSearchParams(window.location.search);
const productId = params.get("productId");

if (productId) {
  setSelectedProductId(productId);
}
    }

    loadProducts();
  }, []);

  return (
    <div className="shopee-page">
      {errorMessage && (
        <div style={{ padding: "40px", color: "red" }}>
          Erro: {errorMessage}
        </div>
      )}
<div style={{
  display: "flex",
  justifyContent: "flex-end", // TODO a la derecha
  padding: "10px 14px" // separación de la orilla
}}>

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
      fontSize: "50px",
      color: "#ff7b00"
    }}>
  Shopee
    </span>

    {/* Logo MTI */}
    <img
      src="/avatar/icono2-512.png"
      alt="MTI"
      style={{
        width: "50px",
        height: "50px",
        objectFit: "contain"
      }}
    />

  </div>

</div>
     <ProductCatalog
             products={products}
             onProductClick={handleAffiliateRedirect}
             selectedProductId={selectedProductId}
           />
    </div>
  );
}