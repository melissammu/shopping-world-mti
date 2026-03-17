import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminAfiliadasPage() {
  const [afiliadas, setAfiliadas] = useState([]);

  useEffect(() => {
    fetchAfiliadas();
  }, []);

  async function fetchAfiliadas() {
    const { data, error } = await supabase
      .from("afiliadas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setAfiliadas(data);
    }
  }

  async function aprobar(id) {
    await supabase
      .from("afiliadas")
      .update({ status: "aprovada" })
      .eq("id", id);

    fetchAfiliadas();
  }

  async function rechazar(id) {
    await supabase
      .from("afiliadas")
      .update({ status: "rechazada" })
      .eq("id", id);

    fetchAfiliadas();
  }

  return (
    <div style={{ padding: 30 }}>
      <h2>📊 Afiliadas registradas</h2>

      {afiliadas.map((a) => (
        <div
          key={a.id}
          style={{
            border: "1px solid #ddd",
            padding: 15,
            marginTop: 10,
            borderRadius: 10,
          }}
        >
          <p><strong>Nombre:</strong> {a.nome}</p>
          <p><strong>Email:</strong> {a.email}</p>
          <p><strong>WhatsApp:</strong> {a.whatsapp}</p>
          <p><strong>Status:</strong> {a.status}</p>
          <p><strong>Código:</strong> {a.codigo_ref}</p>

          <button onClick={() => aprobar(a.id)} style={{ marginRight: 10 }}>
            ✅ Aprobar
          </button>

          <button onClick={() => rechazar(a.id)}>
            ❌ Rechazar
          </button>
        </div>
      ))}
    </div>
  );
}