import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-test-email", async (req, res) => {
  try {
    const { to } = req.body;

    const response = await resend.emails.send({
      from: "Shopping World MTI <no-reply@send.shoppingworldmti.com>",
      to: [to],
      subject: "Teste de email 🚀",
      html: `
        <h2>Hola Melissa 💜</h2>
        <p>Este es tu primer email automático desde tu sistema.</p>
        <p>🔥 Tu plataforma ya está viva.</p>
      `,
    });

    res.json({ success: true, response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});
app.post("/send-approval-email", async (req, res) => {
  try {
    const { to, name, loginLink } = req.body;

    if (!to) {
      return res.status(400).json({ error: "Falta el correo destino." });
    }

    if (!loginLink) {
      return res.status(400).json({ error: "Falta el link de acceso." });
    }

    const response = await resend.emails.send({
      from: "Shopping World MTI <no-reply@send.shoppingworldmti.com>",
      to: [to],
      subject: "Cadastro aprovado - Shopping World MTI",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #222;">
          <h2>Parabéns${name ? `, ${name}` : ""} 🎉</h2>
          <p>Seu cadastro foi aprovado com sucesso.</p>
          <p>Agora você já faz parte do programa de afiliados da <strong>Shopping World MTI</strong>.</p>
          <p>Para acessar sua área de afiliado, clique no botão abaixo:</p>

          <div style="margin: 24px 0;">
            <a href="${loginLink}" 
               style="background-color: #2563eb; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Acessar área da afiliado
            </a>
          </div>

          <p>Se o botão acima não funcionar, copie e cole este link no seu navegador:</p>
          <p><a href="${loginLink}">${loginLink}</a></p>

          <p>Desejamos muito sucesso nas suas vendas.</p>
          <br />
          <p>Atenciosamente,</p>
          <p><strong>Equipe Shopping World MTI</strong></p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "E-mail de aprovação enviado com sucesso.",
      response,
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail de aprovação:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Erro interno do servidor.",
    });
  }
});
app.post("/send-rejection-email", async (req, res) => {
  try {
    const { to, name } = req.body;

    if (!to) {
      return res.status(400).json({ error: "Falta el correo destino." });
    }

    const response = await resend.emails.send({
      from: "Shopping World MTI <no-reply@send.shoppingworldmti.com>",
      to: [to],
      subject: "Atualização do seu cadastro - Shopping World MTI",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #222;">
          <h2>Olá${name ? `, ${name}` : ""}</h2>
          <p>Agradecemos pelo seu interesse em fazer parte do programa de afiliados da <strong>Shopping World MTI</strong>.</p>
          <p>No momento, <strong>não temos vagas disponíveis</strong> para dar continuidade à sua aprovação.</p>
          <p>Recomendamos que você continue se preparando para atender a todos os requisitos do programa e permaneça acompanhando nossas atualizações.</p>
          <p>Assim que novas vagas forem abertas, teremos satisfação em analisar novamente o seu perfil.</p>
          <br />
          <p>Agradecemos pela sua compreensão.</p>
          <br />
          <p>Atenciosamente,</p>
          <p><strong>Equipe Shopping World MTI</strong></p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "E-mail de não aprovação enviado com sucesso.",
      response,
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail de não aprovação:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Erro interno do servidor.",
    });
  }
});
app.post("/send-registration-email", async (req, res) => {
  try {
    const { to, name } = req.body;

    if (!to) {
      return res.status(400).json({ error: "Falta el correo destino." });
    }

    const response = await resend.emails.send({
      from: "Shopping World MTI <no-reply@send.shoppingworldmti.com>",
      to: [to],
      subject: "Cadastro recebido - Shopping World MTI",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #222;">
          <h2>Olá${name ? `, ${name}` : ""} 💜</h2>
          <p>Recebemos seu cadastro de afiliado com sucesso.</p>
          <p>Agora nossa equipe irá analisar suas informações e verificar se o seu perfil atende aos requisitos atuais do programa.</p>
          <p>Assim que houver uma atualização sobre o seu cadastro, você receberá um novo e-mail.</p>
          <br />
          <p>Atenciosamente,</p>
          <p><strong>Equipe Shopping World MTI</strong></p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "E-mail de cadastro enviado com sucesso.",
      response,
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail de cadastro:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Erro interno do servidor.",
    });
  }
});