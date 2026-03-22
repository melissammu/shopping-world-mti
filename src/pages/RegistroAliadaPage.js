import React, { useState } from "react";
import { supabase } from "../lib/supabase";

export default function RegistroAliadaPage() {
  const [form, setForm] = useState({
    codigo_pais: "+55",
    whatsapp: "",
    nome: "",
    email: "",
    password: "",
    confirm_password: "",
    pais: "",
    plataforma: "",
    metodo_pagamento: "",
    recebe_pagamentos: "",
  });

  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
  e.preventDefault();
  setMsg("");

  try {

    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;

    if (!regex.test(form.password)) {
      setMsg("A senha deve conter pelo menos 1 letra maiúscula, 1 número e 1 símbolo.");
      return;
    }

    if (form.password !== form.confirm_password) {
      setMsg("As senhas não coincidem.");
      return;
    }

    // 🔐 Crear usuario
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) throw error;

    const user = data.user;
    const gerarCodigoRef = () => {
  return "MTI-" + Date.now().toString().slice(-5);
};

const codigoRef = gerarCodigoRef();

    // 💾 Guardar en tabla afiliadas
    const { error: insertError } = await supabase
      .from("afiliadas")
      .insert([
  {
    auth_user_id: user.id,
    nome: form.nome,
    email: form.email,
    whatsapp: `${form.codigo_pais} ${form.whatsapp}`,
    pais: form.pais,
    plataforma: form.plataforma,
    metodo_pagamento: form.metodo_pagamento,
    nome_titular: form.nome_titular,
    chave_pix: form.metodo_pagamento === "pix" ? form.chave_pix : null,
    paypal_email: form.metodo_pagamento === "paypal" ? form.paypal_email : null,
    role: "aliada",
    status: "pendente",
  }
])

    if (insertError) throw insertError;

    setMsg("Cadastro enviado para aprovação!");

  } catch (err) {
    console.log("ERROR DETALLE:", err);
    alert(err.message);
    setMsg(err.message || "Erro ao cadastrar.");
  }
}
  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: 12,
    border: "1px solid #ddd",
    outline: "none",
    fontSize: 16,
    boxSizing: "border-box",
  };

  const passwordInputStyle = {
    width: "100%",
    padding: "12px 42px 12px 12px",
    borderRadius: 12,
    border: "1px solid #ddd",
    outline: "none",
    fontSize: 16,
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f7f7f7",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 500,
          background: "#fff",
          padding: 30,
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          🤝 Cadastro de Afiliada
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <input
            name="nome"
            placeholder="Nome completo"
            value={form.nome}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="email"
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Crie uma senha para acessar sua conta"
              value={form.password}
              onChange={handleChange}
              required
              style={passwordInputStyle}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: 18,
                userSelect: "none",
              }}
            >
              {showPassword ? "👁️" : "😌"}
            </span>
          </div>

          <p style={{ fontSize: 12, color: "#777", marginTop: -4, marginBottom: 0 }}>
            A senha deve conter pelo menos 1 letra maiúscula, 1 número e 1 símbolo.
          </p>

          <div style={{ position: "relative" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm_password"
              placeholder="Confirme sua senha"
              value={form.confirm_password}
              onChange={handleChange}
              required
              style={passwordInputStyle}
            />

            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: 18,
                userSelect: "none",
              }}
            >
              {showConfirmPassword ? "👁️" : "😌"}
            </span>
          </div>

          <input
            name="pais"
            placeholder="País"
            value={form.pais}
            onChange={handleChange}
            required
            style={inputStyle}
       />

          <div style={{ display: "flex", gap: 10 }}>
            <select
              name="codigo_pais"
              value={form.codigo_pais}
              onChange={handleChange}
              style={{
                padding: 12,
                borderRadius: 12,
                border: "1px solid #ddd",
                outline: "none",
                fontSize: 16,
                boxSizing: "border-box",
              }}
            >
              <option value="+55">BR Brasil (+55)</option>
              <option value="+57">CO Colombia (+57)</option>
              <option value="+58">VE Venezuela (+58)</option>
              <option value="+1">US Estados Unidos (+1)</option>
              <option value="+52">MX México (+52)</option>
              <option value="+54">AR Argentina (+54)</option>
            </select>

            <input
              type="text"
              name="whatsapp"
              placeholder="Número de WhatsApp"
              value={form.whatsapp}
              onChange={handleChange}
              required
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                border: "1px solid #ddd",
                outline: "none",
                fontSize: 16,
                boxSizing: "border-box",
              }}
            />
          </div>

          <input
            name="plataforma"
            placeholder="Plataforma (TikTok, Instagram...)"
            value={form.plataforma}
            onChange={handleChange}
            style={inputStyle}
          />
          <select
  name="metodo_pagamento"
  value={form.metodo_pagamento}
  onChange={handleChange}
  required
  style={{
    padding: 12,
    borderRadius: 12,
    border: "1px solid #ddd",
  }}
>
  <option value="">Escolha como deseja receber</option>
  <option value="pix">Pix</option>
  <option value="paypal">PayPal</option>
</select>
{form.metodo_pagamento === "pix" && (
  <>
    <input
      name="nome_titular"
      placeholder="Nome do titular"
      onChange={handleChange}
      required
      style={inputStyle}
    />

    <input
      name="chave_pix"
      placeholder="Chave Pix (CPF, email, telefone...)"
      onChange={handleChange}
      required
      style={inputStyle}
    />
  </>
)}
{form.metodo_pagamento === "paypal" && (
  <>
    <input
      name="nome_titular"
      placeholder="Nome do titular"
      onChange={handleChange}
      required
      style={inputStyle}
    />

    <input
      type="email"
      name="paypal_email"
      placeholder="Email do PayPal"
      onChange={handleChange}
      required
      style={inputStyle}
    />
  </>
) }

          <button
            type="submit"
            style={{
              marginTop: 10,
              padding: 14,
              borderRadius: 12,
              border: "none",
              background: "#ff9800",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Enviar cadastro
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 12 }}>{msg}</p>
      </div>
    </div>
  );
}