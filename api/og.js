export default function handler(req, res) {
  const { name, image, price, link } = req.query;

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta property="og:title" content="${name}" />
      <meta property="og:description" content="Precio: ${price}" />
      <meta property="og:image" content="${image}" />
      <meta property="og:url" content="${link}" />
      <meta property="og:type" content="website" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${name}" />
      <meta name="twitter:description" content="Precio: ${price}" />
      <meta name="twitter:image" content="${image}" />

      <script>
        window.location.href = "${link}";
      </script>
    </head>
    <body>
      Redirecionando...
    </body>
  </html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
}