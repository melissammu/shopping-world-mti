import { supabase } from "./supabase";

export const registerAfiliateClick = async (product) => {
  try {
    const codigo_ref = localStorage.getItem("affiliate_ref") || "sin-ref";
    const productId = String(product?.id || "sin-id");

    console.log("DEBUG CLICK:", {
      codigo_ref,
      productId,
      product,
    });

    const { error: clickError } = await supabase
      .from("clicks")
      .insert([
        {
          codigo_ref: codigo_ref,
          product_id: productId,
          product_name: product.name || "Producto sin nombre",
          store: product.store || "unknown",
        },
      ]);

    if (clickError) {
      console.error("ERROR insert clicks:", clickError);
      return false;
    }

    console.log("CLICK GUARDADO EN clicks OK");
    return true;
  } catch (error) {
    console.error("ERROR GENERAL registerAfiliateClick:", error);
    return false;
  }
};