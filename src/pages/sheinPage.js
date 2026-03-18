import React, { useEffect, useState } from "react";
import ProductCatalog from "../components/ProductCatalog";
import { supabase } from "../lib/supabase";

export default function SheinPage() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [codigoAfiliada, setCodigoAfiliada] = useState("");

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");

  if (ref) {
    setCodigoAfiliada(ref);
    localStorage.setItem("codigoAfiliada", ref);
    console.log("Código de afiliada detectado:", ref);
  }
}, []);

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
            "/produtos/placeholder-shein.jpg";

          return {
            id: p.id,
            name: p.title || p.name || "Produto sem nome",
            price: p.price || "",
            image: finalImage,
            image_url: finalImage,
            link: finalLink,
            category: p.category || "Sem categoria",
            store: p.store || "shein",
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