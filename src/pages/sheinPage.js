import React, { useEffect, useState } from "react";
import ProductCatalog from "../components/ProductCatalog";
import { supabase } from "../lib/supabase";

export default function SheinPage() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");

    if (ref) {
      localStorage.setItem("ref_afiliado", ref);
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
            (typeof p.image === "string" && p.image.trim()) ||
            "/produtos/placeholder-shein.jpg";

          return {
            id: p.id,
            name: p.title || p.name || "Produto sem nome",
            price: p.price || p.preco || "",
            image: finalImage,
            image_url: finalImage,
            link: finalLink,
            category: p.category || p.categoria || "Sem categoria",
            store: p.store || "shein",
          };
        })
        .filter(Boolean);

      setProducts(formattedProducts);
    }

    loadProducts();
  }, []);

  const registrarClick = async (product) => {
    try {
      const ref = localStorage.getItem("ref_afiliado");

      const { error } = await supabase.from("clicks").insert([
        {
          ref: ref || null,
          product_id: String(product.id),
          store: "shein",
        },
      ]);

      if (error) {
        console.error("Erro guardando click:", error);
      }
    } catch (err) {
      console.error("Erro inesperado ao registrar click:", err);
    }
  };
  useEffect(() => {
  const testInsert = async () => {
    const { data, error } = await supabase.from("clicks").insert([
      {
        ref: "TEST-MANUAL",
        product_id: "999999",
        store: "shein-test",
      },
    ]);

    console.log("TEST INSERT DATA:", data);
    console.log("TEST INSERT ERROR:", error);
  };

  testInsert();
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
        onProductClick={registrarClick}
      />
    </div>
  );
}