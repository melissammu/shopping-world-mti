export default function handler(req, res) {
  try {
    const { store, id } = req.query;

    // 🔥 valores seguros (temporal)
    const image = "https://shoppingworldmti.com/produtos/placeholder-shein.jpg";
    const link = `https://shoppingworldmti.com/${store || ""}?product=${id || ""}`;

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="Producto recomendado" />
        <meta property="og:description" content="Mira este producto 🔥" />
        <meta property="og:image" content="${image}" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${link}" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="${image}" />

        <script>
          window.location.href = "${link}";
        </script>
      </head>
      <body></body>
    </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);

  } catch (error) {
    console.error("OG ERROR:", error);
    res.status(500).send("Error interno en OG");
  }
}