import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { store, id } = req.query;

  const cleanId = extractNumericId(id);

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
      redirectPath: "/amazonUsa",
    },
    mercadoli: {
      table: "products",
      redirectPath: "/mercadoLi",
      extraFilter: { column: "store", value: "mercadoLi" },
    },
  };

  const config = storeConfig[store];

  if (!config) {
    return res.status(400).send("Store inválida.");
  }

  let product = null;

  try {
    let query = supabase
      .from(config.table)
      .select("*")
      .eq("id", Number(cleanId));

    if (config.extraFilter) {
      query = query.eq(config.extraFilter.column, config.extraFilter.value);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error("Erro ao buscar produto:", error);
    } else {
      product = data;
    }

    console.log("STORE:", store);
    console.log("ID:", id);
    console.log("CLEAN ID:", cleanId);
    console.log("PRODUCT:", product);
  } catch (error) {
    console.error("Erro geral ao buscar produto:", error);
  }

  const finalLink = `https://www.shoppingworldmti.com${config.redirectPath}?product=${cleanId}`;

  const productImage =
    product?.image_url ||
    product?.image ||
    "https://www.shoppingworldmti.com/avatar/shop_word3.png";

  const safeImage = escapeHtml(productImage);
  const safeLink = escapeHtml(finalLink);

  const html = `
  <!DOCTYPE html>
  <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />

      <meta property="og:image" content="${safeImage}" />
      <meta property="og:url" content="${safeLink}" />
      <meta property="og:type" content="website" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="${safeImage}" />

      <script>
        window.location.replace("${safeLink}");
      </script>
    </head>
    <body>
      Redirecionando...
    </body>
  </html>
  `;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(html);
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