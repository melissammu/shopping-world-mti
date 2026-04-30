import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    const { store, id } = req.query;

    console.log("STORE:", store);
    console.log("RAW ID:", id);

    const cleanId = extractNumericId(id);
    console.log("CLEAN ID:", cleanId);

    const storeConfig = {
      shein: {
        table: "products",
        redirectPath: "/shein",
        extraFilter: { column: "store", value: "shein" },
      },
      amazon: {
        table: "amazon_products",
        redirectPath: "/amazon",
      },
      amazonusa: {
        table: "amazon_usa_products",
        redirectPath: "/amazonusa",
      },
      mercadoli: {
        table: "mercado_livre_br",
        redirectPath: "/mercadoli",
      },
    };

    const config = storeConfig[store];
    console.log("CONFIG:", config);

    if (!config) {
      return res.status(400).send(`Store inválida: ${store}`);
    }

    if (!cleanId) {
      return res.status(400).send(`ID inválido: ${id}`);
    }

    let query = supabase
      .from(config.table)
      .select("*")
      .eq("id", Number(cleanId));

    if (config.extraFilter) {
      query = query.eq(
        config.extraFilter.column,
        config.extraFilter.value
      );
    }

    const { data: product, error } = await query.maybeSingle();

    if (!product) {
      return res.status(404).send("Produto não encontrado");
    }

    const finalLink = `https://www.shoppingworldmti.com/?product=${store}-${cleanId}`;

    const productTitle =
      product.title2 ||
      product.title ||
      product.name ||
      "Shopping World MTI";

    const productPrice = product.price
      ? `Preço: ${product.price}`
      : "Confira este produto";

    const productImage =
      product.image_url ||
      product.image ||
      "https://shoppingworldmti.com/avatar/nuevologohome.png";

    const safeTitle = escapeHtml(productTitle);
    const safePrice = escapeHtml(productPrice);
    const safeImage = escapeHtml(productImage);
    const safeLink = escapeHtml(finalLink);

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>${safeTitle}</title>

  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safePrice}" />
  <meta property="og:image" content="${safeImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${safeLink}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safePrice}" />
  <meta name="twitter:image" content="${safeImage}" />

  <script>
    window.location.replace("${safeLink}");
  </script>
</head>
<body>
  Redirecionando...
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(html);
  } catch (err) {
    console.error("ERRO GERAL OG:", err);
    return res.status(500).send(`Erro interno OG: ${err.message}`);
  }
}

function extractNumericId(id = "") {
  const parts = String(id).split("-");
  return parts[parts.length - 1];
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}