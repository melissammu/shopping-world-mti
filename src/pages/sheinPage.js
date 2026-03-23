import React, { useEffect, useState } from "react";
import ProductCatalog from "../components/ProductCatalog";
import { supabase } from "../lib/supabase";
import { registerAfiliateClick } from "../lib/registerAfiliateClick";

export default function SheinPage() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Registrar click afiliado y luego abrir link externo
const handleAffiliateRedirect = async (product) => {
  console.log("CLICK REAL EN SHEIN:", product);

  const safeLink =
    (product.link_br && product.link_br.trim()) ||
    (product.link_us && product.link_us.trim()) ||
    (product.link && product.link.trim()) ||
    "";

  if (!safeLink) {
    console.log("Producto sin link válido");
    return;
  }

  try {
    await registerAfiliateClick(product); // lo dejamos pero no bloquea

    // 🔥 REDIRECCIÓN SIEMPRE
    window.open(safeLink, "_blank", "noopener,noreferrer");

  } catch (error) {
    console.error("Error en redirect:", error);

    // 🔥 INCLUSO SI FALLA, REDIRIGE
    window.open(safeLink, "_blank", "noopener,noreferrer");
  }
};

  // Guardar ref de afiliada
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");

    if (ref) {
      localStorage.setItem("affiliate_ref", ref);
      console.log("REF guardado en SHEIN:", ref);
    }
  }, []);

  // Cargar productos Shein
  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("store", "shein")
        .order("id", { ascending: false });

      if (error) {
        console.error("Erro ao buscar produtos Shein:", error);
        setErrorMessage(error.message);
        return;
      }

      const formattedProducts = (data || []).map((p) => {
        const finalLink =
          (p.link_br && p.link_br.trim()) ||
          (p.link_us && p.link_us.trim()) ||
          (p.link && p.link.trim()) ||
          "";

        const finalImage =
          (p.image_url && p.image_url.trim()) ||
          (typeof p.image === "string" && p.image.trim()) ||
          "/produtos/placeholder-shein.jpg";

        return {
          id: p.id,
          name: p.title || p.name || "Produto sem nome",
          price: p.price || "",
          image: finalImage,
          image_url: finalImage,
          link: finalLink,
          category: p.category || p.categoria || "Sem categoria",
          store: p.store || "shein",
          country: "BR",
        };
      });

      console.log("Produtos Shein carregados:", formattedProducts);
      setProducts(formattedProducts);
    }

    loadProducts();
  }, []);

  return (
    <div className="shein-page">
      {errorMessage && (
        <div style={{ padding: "10px", color: "red", textAlign: "center" }}>
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