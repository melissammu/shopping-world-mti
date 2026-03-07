import React, { useEffect, useState } from "react";
import ProductCatalog from "../components/ProductCatalog";
import { supabase } from "../lib/supabase";

export default function AmazonPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("amazon_products")
        .select("*");

      if (error) {
        console.error("Erro carregando produtos:", error);
        return;
      }

      const formattedProducts = data.map((item) => ({
        id: item.id,
        name: item.title,
        price: item.price,
        images: [item.image],
        link: item.link,
        tag: item.tag || "Oferta",
      }));

      console.log("Produtos formatados:", formattedProducts);
      setProducts(formattedProducts);
    }

    fetchProducts();
  }, []);

  return <ProductCatalog products={products} />;
}