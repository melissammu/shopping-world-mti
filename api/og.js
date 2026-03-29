export default function handler(req, res) {
  const { name, image, price, link } = req.query;

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta property="og:title" content="${name}" />
      <meta property="og:image" content="${image}" />
      <meta property="og:url" content="${link}" />

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