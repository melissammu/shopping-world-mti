export default function handler(req, res) {
  const { store, id } = req.query;

  const storeMap = {
    shein: "/shein",
    amazon: "/amazon",
    amazonusa: "/amazonUsa",
    mercadoli: "/mercadoLi",
  };

  const fallbackImage = "https://shoppingworldmti.com/avatar/shop_word3.png";
  const fallbackTitle = "Shopping World MTI";
  const fallbackPrice = "Confira este produto";
  const redirectPath = storeMap[store] || "/";

  const finalLink = `https://shoppingworldmti.com${redirectPath}?product=${id}`;

  const html = `
  <!DOCTYPE html>
  <html lang="pt-BR">
    <head>
     <meta property="og:title" content="${fallbackTitle}" />
<meta property="og:description" content="${fallbackPrice}" />
<meta property="og:image" content="${fallbackImage}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />
<meta property="og:url" content="${finalLink}" />
<meta property="og:type" content="website" />

      <script>
        window.location.replace("${finalLink}");
      </script>
    </head>
    <body>
      Redirecionando...
    </body>
  </html>
  `;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}