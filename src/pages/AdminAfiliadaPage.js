import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminAfiliadasPage() {
  const [afiliadas, setAfiliadas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  useEffect(() => {
    fetchAfiliadas();
  }, []);

  async function fetchAfiliadas() {
    const { data, error } = await supabase
      .from("afiliadas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Erro ao buscar afiliadas:", error);
      return;
    }

    setAfiliadas(data || []);
  }

  async function aprobar(id) {
    const { error } = await supabase
      .from("afiliadas")
      .update({ status: "aprovada" })
      .eq("id", id);

    if (error) {
      setMensaje("❌ Houve um erro ao aprovar a afiliada.");
      setTipoMensaje("error");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

    setMensaje("🎉 Parabéns! Você foi aprovada na Shopping World MTI.");
    setTipoMensaje("success");
    fetchAfiliadas();
    setTimeout(() => setMensaje(""), 4000);
  }

  async function rechazar(id) {
    const { error } = await supabase
      .from("afiliadas")
      .update({ status: "rejeitada" })
      .eq("id", id);

    if (error) {
      setMensaje("❌ Houve um erro ao rejeitar a afiliada.");
      setTipoMensaje("error");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

    setMensaje(
      "✨ Obrigada pelo seu interesse. Continue se preparando e, ao atender aos critérios da Shopping World MTI, você poderá tentar novamente."
    );
    setTipoMensaje("info");
    fetchAfiliadas();
    setTimeout(() => setMensaje(""), 5000);
  }

  function getStatusColor(status) {
    if (status === "aprovada") return "#155724";
    if (status === "rejeitada") return "#721c24";
    return "#856404";
  }

  function getStatusBg(status) {
    if (status === "aprovada") return "#d4edda";
    if (status === "rejeitada") return "#f8d7da";
    return "#fff3cd";
  }

  return (
    <div style={{ padding: 30 }}>
      {mensaje && (
        <div
          style={{
            marginBottom: 20,
            padding: 15,
            borderRadius: 10,
            backgroundColor:
              tipoMensaje === "success"
                ? "#d4edda"
                : tipoMensaje === "error"
                ? "#f8d7da"
                : "#e2e3e5",
            color:
              tipoMensaje === "success"
                ? "#155724"
                : tipoMensaje === "error"
                ? "#721c24"
                : "#383d41",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {mensaje}
        </div>
      )}

      <h2>📋 Afiliadas registradas</h2>

      {afiliadas.length === 0 ? (
        <p>Nenhuma afiliada encontrada.</p>
      ) : (
        afiliadas.map((a) => (
          <div
            key={a.id}
            style={{
              border: "1px solid #ddd",
              padding: 15,
              marginTop: 15,
              borderRadius: 10,
              background: "#fff",
            }}
          >
            <p>
              <strong>Nome:</strong> {a.nome}
            </p>
            <p>
              <strong>Email:</strong> {a.email}
            </p>
            <p>
              <strong>WhatsApp:</strong> {a.whatsapp}
            </p>
            <p>
              <strong>País:</strong> {a.pais}
            </p>
            <p>
              <strong>Instagram:</strong> {a.instagram}
            </p>
            <p>
              <strong>Método de pagamento:</strong> {a.metodo_pagamento}
            </p>
            <p>
              <strong>Código:</strong> {a.codigo_ref}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 8,
                  backgroundColor: getStatusBg(a.status),
                  color: getStatusColor(a.status),
                  fontWeight: "bold",
                }}
              >
                {a.status || "pendente"}
              </span>
            </p>

            <div style={{ marginTop: 12 }}>
              <button
                onClick={() => aprobar(a.id)}
                style={{
                  marginRight: 10,
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: 8,
                  background: "#28a745",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ✅ Aprovar
              </button>

              <button
                onClick={() => rechazar(a.id)}
                style={{
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: 8,
                  background: "#dc3545",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ❌ Rejeitar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}