export default function handler(req, res) {
  try {
    const { store, id } = req.query;

    const image = "https://shoppingworldmti.com/produtos/placeholder-shein.jpg";
   const link = `https://shoppingworldmti.com/${store || "shein"}`;
   
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta property="og:title" content="Producto recomendado" />
        <meta property="og:description" content="Mira este producto en Shopping World MTI" />
        <meta property="og:image" content="${image}" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${link}" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="${image}" />

        <meta http-equiv="refresh" content="1;url=${link}" />
      </head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 40px;">
        <h2>Abriendo producto...</h2>
        <p>Si no redirige automáticamente, toca el botón.</p>
        <a href="${link}" style="
          display:inline-block;
          margin-top:20px;
          padding:12px 20px;
          background:#111;
          color:#fff;
          text-decoration:none;
          border-radius:10px;
        ">Ver producto</a>
      </body>
    </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (error) {
    console.error("OG ERROR:", error);
    res.status(500).send("Error interno en OG");
  }
}