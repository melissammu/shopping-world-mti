import React, { useState } from "react";
import { supabase } from "../lib/supabase"; // ajusta la ruta si tu archivo tiene otro nombre
import "./RegistroAliadaPage.css";

export default function RegistroAliadaPage() {
  const[mensaje, setMensaje] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    ddi: "",
    telefone: "",
    endereco: "",
    cep: "",
    rede_social: "",
    metodo_pagamento: "",
    chave_pix: "",
    paypal_email: "",
  });

  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erroMsg, setErroMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const gerarCodigoUnico = async () => {
    let codigo = "";
    let existe = true;

    while (existe) {
      codigo = `afi_${crypto.randomUUID().slice(0, 8)}`;

      const { data, error } = await supabase
        .from("afiliadas")
        .select("codigo_ref")
        .eq("codigo_ref", codigo)
        .maybeSingle();

      if (error) {
        throw new Error("Erro ao validar código da afiliada.");
      }

      if (!data) {
        existe = false;
      }
    }

    return codigo;
  };

  const validarFormulario = () => {
    if (!formData.nome.trim()) return "Informe seu nome completo.";
    if (!formData.email.trim()) return "Informe seu e-mail.";
    if (!formData.password.trim()) return "Crie uma senha.";
    if (formData.password.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }
    if (!formData.ddi.trim()) return "Selecione o DDI.";
    if (!formData.telefone.trim()) return "Informe seu telefone.";
    if (!formData.endereco.trim()) return "Informe seu endereço.";
    if (!formData.cep.trim()) return "Informe seu CEP.";
    if (!formData.rede_social.trim()) return "Informe sua rede social.";
    if (!formData.metodo_pagamento.trim()) {
      return "Selecione um método de pagamento.";
    }

    if (
      formData.metodo_pagamento === "Pix" &&
      !formData.chave_pix.trim()
    ) {
      return "Informe sua chave Pix.";
    }

    if (
      formData.metodo_pagamento === "PayPal" &&
      !formData.paypal_email.trim()
    ) {
      return "Informe seu e-mail do PayPal.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true); // 👈 activa loading

  setMensagem("No momento não temos vagas de afiliadas disponível");
  setErroMsg("");

  return;
};

  return (
    <div className="registro-aliada-page">
      <div className="registro-card">
        <h1 className="registro-title">Cadastro de Afiliada</h1>
        <p className="registro-subtitle">
          Preencha seus dados para participar do programa de afiliadas da Shopping World MTI.
        </p>

        <form onSubmit={handleSubmit} className="registro-form">
          <div className="form-group">
            <label>Nome completo</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
            />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu e-mail"
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Crie sua senha"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>DDI</label>
              <select
                name="ddi"
                value={formData.ddi}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="+55">BR Brasil (+55)</option>
                <option value="+58">VE Venezuela (+58)</option>
                <option value="+1">US Estados Unidos (+1)</option>
                <option value="+52">MX México (+52)</option>
                <option value="+54">AR Argentina (+54)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Telefone</label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="41 99999-9999"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Endereço</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              placeholder="Digite seu endereço"
            />
          </div>

          <div className="form-group">
            <label>CEP</label>
            <input
              type="text"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              placeholder="Digite seu CEP"
            />
          </div>

          <div className="form-group">
            <label>Rede social</label>
            <input
              type="text"
              name="rede_social"
              value={formData.rede_social}
              onChange={handleChange}
              placeholder="@seuusuario"
            />
          </div>

          <div className="form-group">
            <label>Método de pagamento</label>
            <select
              name="metodo_pagamento"
              value={formData.metodo_pagamento}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="Pix">Pix</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>

          {formData.metodo_pagamento === "Pix" && (
            <div className="form-group">
              <label>Chave Pix</label>
              <input
                type="text"
                name="chave_pix"
                value={formData.chave_pix}
                onChange={handleChange}
                placeholder="Digite sua chave Pix"
              />
            </div>
          )}

          {formData.metodo_pagamento === "PayPal" && (
            <div className="form-group">
              <label>E-mail do PayPal</label>
              <input
                type="email"
                name="paypal_email"
                value={formData.paypal_email}
                onChange={handleChange}
                placeholder="Digite seu e-mail do PayPal"
              />
            </div>
          )}

          <div className="termos-box">
            <h2>Políticas do Programa de Afiliadas</h2>

            <p>
              <strong>1. Objeto do Programa</strong><br />
              O programa de afiliadas da Shopping World MTI permite que usuárias promovam produtos de terceiros por meio de links exclusivos, recebendo comissão sobre compras válidas realizadas através desses links.
            </p>

            <p>
              <strong>2. Cadastro e Aprovação</strong><br />
              O cadastro não garante aprovação automática. Todas as solicitações serão analisadas pela Shopping World MTI, que poderá aprovar ou rejeitar qualquer cadastro sem necessidade de justificativa.
            </p>

            <p>
              <strong>3. Funcionamento</strong><br />
              Cada afiliada receberá um código de referência único. O rastreamento das compras depende dos sistemas e regras das plataformas parceiras.
            </p>

            <p>
              <strong>4. Comissão</strong><br />
              A afiliada receberá 3% de comissão sobre compras válidas realizadas por meio do seu link, desde que a compra seja corretamente rastreada, validada, entregue e não seja cancelada ou devolvida.
            </p>

            <p>
              <strong>5. Liberação de Comissões e Pagamentos</strong><br /><br />
              5.1. As comissões geradas pelas afiliadas somente serão consideradas válidas após a confirmação integral da compra, incluindo a entrega do produto ao cliente final e a ausência de cancelamentos, devoluções ou reembolsos.
              <br /><br />
              5.2. A liberação das comissões está condicionada exclusivamente às regras, prazos e políticas das plataformas parceiras utilizadas pela Shopping World MTI, não havendo qualquer controle direto da empresa sobre tais processos.
              <br /><br />
              5.3. Os prazos estimados para liberação das comissões são:
              <br />
              - SHEIN: aproximadamente 45 (quarenta e cinco) dias após a validação da compra<br />
              - Amazon: aproximadamente 60 (sessenta) dias após a realização da compra<br />
              - Mercado Livre Brasil: até 60 (sessenta) dias após a confirmação da entrega e validação da compra
              <br /><br />
              5.4. Os prazos acima são estimativas e podem sofrer alterações de acordo com as políticas internas de cada plataforma parceira, não sendo de responsabilidade da Shopping World MTI eventuais atrasos.
              <br /><br />
              5.5. A Shopping World MTI somente realizará o pagamento das comissões às afiliadas após a efetiva liberação e confirmação dos valores pelas plataformas parceiras.
              <br /><br />
              5.6. A empresa não se responsabiliza por atrasos na liberação das comissões, retenções realizadas pelas plataformas, divergências de valores ou recusas de comissões.
              <br /><br />
              5.7. Não haverá pagamento de comissões em casos de compras canceladas, pedidos devolvidos, reembolsos ou atividades consideradas fraudulentas.
              <br /><br />
              5.8. Os pagamentos poderão ser realizados via Pix ou PayPal, conforme os dados informados pela afiliada.
              <br /><br />
              5.9. A Shopping World MTI poderá estabelecer valor mínimo para saque e prazos operacionais para processamento dos pagamentos após a liberação das comissões.
              <br /><br />
              5.10. A participação no programa de afiliadas não garante ganhos financeiros, estando estes condicionados à realização de compras válidas por terceiros e à aprovação das mesmas pelas plataformas parceiras.
            </p>

            <p>
              <strong>6. Condutas Proibidas</strong><br />
              É proibido criar múltiplas contas, manipular cliques, utilizar bots, praticar spam, realizar fraudes ou tentar gerar comissão indevida.
            </p>

            <p>
              <strong>7. Responsabilidade</strong><br />
              A Shopping World MTI não se responsabiliza por entrega, qualidade dos produtos, cancelamentos, reembolsos ou políticas das plataformas terceiras.
            </p>

            <p>
              <strong>8. Privacidade</strong><br />
              Os dados informados serão tratados conforme a legislação aplicável, incluindo a LGPD.
            </p>

            <p>
              <strong>9. Alterações</strong><br />
              A Shopping World MTI poderá alterar estas políticas a qualquer momento.
            </p>

            <p>
              <strong>10. Aceitação dos Termos</strong><br />
              Para concluir o cadastro, a afiliada deverá declarar que concorda com os acordos, políticas e termos da Shopping World MTI.
            </p>
          </div>

          <div className="checkbox-termos">
            <label>
              <input
                type="checkbox"
                checked={aceitaTermos}
                onChange={(e) => setAceitaTermos(e.target.checked)}
              />
              {" "}
              Concordo com os acordos, políticas e termos da Shopping World MTI.
            </label>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Enviando..." : "Enviar cadastro"}
          </button>

          {mensagem && <p className="alerta-vagas-msg">{mensagem}</p>}
          {erroMsg && <p className="alerta-vagas-msg">{erroMsg}</p>}
        </form>
      </div>
    </div>
  );
}