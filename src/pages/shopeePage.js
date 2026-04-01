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
  name: p.title || p.name || "Produto sem nome",
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

     <ProductCatalog
             products={products}
             onProductClick={handleAffiliateRedirect}
             selectedProductId={selectedProductId}
           />
    </div>
  );
}