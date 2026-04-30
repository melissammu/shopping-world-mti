export default function handler(req, res) {
  const { id } = req.query;

  // Simulación (luego lo conectamos a tu base real)
  const products = {
    "mercado-60": {
      title: "Producto increíble",
      image: "https://TU-IMAGEN-REAL.jpg"
    }
  };

  const product = products[id];

  res.setHeader("Content-Type", "text/html");

  res.send(`
    <html>
      <head>
        <meta property="og:title" content="${product.title}" />
        <meta property="og:image" content="${product.image}" />
        <meta property="og:url" content="https://shoppingworldmti.com/?product=${id}" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>

      <body>
        <script>
          window.location.href = "/?product=${id}";
        </script>
      </body>
    </html>
  `);
}