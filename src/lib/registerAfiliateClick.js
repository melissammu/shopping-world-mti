import { supabase } from "./supabase";

export const registerAfiliateClick = async (product) => {
  try {
    console.log("Guardando click:", product);

    const ref = localStorage.getItem("afiliate_ref") || "sin-ref";

    const productId = String(product?.id || "");
    const productName =
      product?.title ||
      product?.name ||
      "Producto sin nombre";

    const store =
      product?.store ||
      product?.platform ||
      "unknown";

    const externalLink =
      product?.link_br?.trim() ||
      product?.link_us?.trim() ||
      product?.link?.trim() ||
      "";

    if (!productId) {
      console.warn("registerAffiliateClick: producto sin id");
      return false;
    }

    // 1) Guarda historial del click
    const { error: clickError } = await supabase.from("clicks").insert([
      {
        ref,
        product_id: productId,
        product_name: productName,
        store,
        external_link: externalLink,
      },
    ]);

    if (clickError) {
      console.error("Error guardando click en tabla clicks:", clickError);
    }

    // 2) Busca si ya existe en resumen
    const { data: existing, error: existingError } = await supabase
      .from("clicks_resumen")
      .select("*")
      .eq("ref", ref)
      .eq("product_id", productId)
      .maybeSingle();

    if (existingError) {
      console.error("Error buscando resumen:", existingError);
      return false;
    }

    // 3) Actualiza o inserta resumen
    if (existing) {
      const { error: updateError } = await supabase
        .from("clicks_resumen")
        .update({
          total_clicks: (existing.total_clicks || 0) + 1,
          product_name: productName,
          store,
          external_link: externalLink,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (updateError) {
        console.error("Error actualizando clicks_resumen:", updateError);
        return false;
      }
    } else {
      const { error: insertResumenError } = await supabase
        .from("clicks_resumen")
        .insert([
          {
            ref,
            product_id: productId,
            product_name: productName,
            store,
            external_link: externalLink,
            total_clicks: 1,
            updated_at: new Date().toISOString(),
          },
        ]);

      if (insertResumenError) {
        console.error("Error insertando clicks_resumen:", insertResumenError);
        return false;
      }
    }

    console.log("Click registrado correctamente");
    return true;
  } catch (error) {
    console.error("Error general en registerAfiliateClick:", error);
    return false;
  }
};