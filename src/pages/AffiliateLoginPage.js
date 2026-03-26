import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import "./AffiliateLoginPage.css";
export default function AffiliateLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage("Email ou senha inválidos.");
        setLoading(false);
        return;
      }

      const { data: afiliada, error: errAfiliada } = await supabase
        .from("afiliadas")
        .select("*")
        .eq("email", email)
        .single();
      if (errAfiliada || !afiliada) {
        setMessage("Seu acesso não está autorizado como afiliada.");
        setLoading(false);
        return;
      }

      if (!afiliada.aprovada) {
        setMessage("Sua solicitação está em análise. Aguarde aprovação.");
        setLoading(false);
        return;
      }

      navigate("/dashboard-afiliada");
    } catch (err) {
      console.error(err);
      setMessage("Ocorreu um erro inesperado.");
    }

    setLoading(false);
  }

  return (
  <div className="affiliate-login-page">
    <div className="affiliate-login-overlay">
      <div className="affiliate-login-card">
        <div className="affiliate-login-brand">
          <span className="brand-badge">Shopping World MTI</span>
          <h1>Área da Afiliada</h1>
          <p>
            Entre com seu email e senha para acompanhar seus cliques,
            oportunidades e ganhos.
          </p>
        </div>

        <form className="affiliate-login-form" onSubmit={handleLogin}>
          <label htmlFor="affiliate-email">Email</label>
          <input
            id="affiliate-email"
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="affiliate-password">Senha</label>
          <input
            id="affiliate-password"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {message && <div className="login-message">{message}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  </div>
);
 }