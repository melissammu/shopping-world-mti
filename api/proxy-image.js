export default async function handler(req, res) {
  try {
   const { url } = req.query;
   
    if (!url) {
      return res.status(400).send("Falta la URL de la imagen");
    }
    const imageUrl = decodeURIComponent(url);

    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Referer: "https://www.google.com/",
      },
    });

    if (!response.ok) {
      return res.status(response.status).send("No se pudo cargar la imagen");
    }

    const contentType =
      response.headers.get("content-type") || "image/jpeg";

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
    return res.status(200).send(buffer);
  } catch (error) {
    console.error("Error proxy-image:", error);
    return res.status(500).send("Error interno del proxy");
  }
}