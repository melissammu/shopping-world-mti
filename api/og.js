export default function handler(req, res) {
  const { store, id } = req.query;

  const html = `
  <!DOCTYPE html>
  <html>
    <head>

      <!--  SOLO IMAGEN -->
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
  res.send(html);
}