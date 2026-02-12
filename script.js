document.getElementById("year").textContent = new Date().getFullYear();

// Ano automático no rodapé
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Orçamento + WhatsApp =====
const tipoProjeto = document.getElementById("tipoProjeto");
const extras = document.querySelectorAll(".extra");
const totalSpan = document.getElementById("totalOrcamento");
const btnWhats = document.getElementById("btnWhatsOrcamento");

// Seu WhatsApp (já correto)
const WHATS_NUMBER = "5541998026807";

function getProjetoLabel() {
  if (!tipoProjeto) return "";
  return tipoProjeto.options[tipoProjeto.selectedIndex].text;
}

function getExtrasSelecionados() {
  const list = [];
  extras.forEach((e) => {
    if (e.checked) {
      const label = e.parentElement?.innerText?.trim() || `Extra (+${e.value})`;
      list.push(label);
    }
  });
  return list;
}

function calcularTotal() {
  if (!tipoProjeto || !totalSpan) return;

  let total = parseFloat(tipoProjeto.value || "0");

  extras.forEach((extra) => {
    if (extra.checked) total += parseFloat(extra.value || "0");
  });

  totalSpan.textContent = total.toFixed(2);

  // Monta mensagem do WhatsApp
  if (btnWhats) {
    const projeto = getProjetoLabel();
    const extrasSel = getExtrasSelecionados();
    const extrasTxt = extrasSel.length ? `Adicionais:\n- ${extrasSel.join("\n- ")}` : "Adicionais: nenhum";
    const msg =
`Olá, Carol! Quero um orçamento.

Projeto: ${projeto}
${extrasTxt}

Total estimado: R$ ${total.toFixed(2)}
Manutenção básica: R$ 150

Pode me passar o prazo e próximos passos?`;

    const url = `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(msg)}`;
    btnWhats.href = url;
  }
}

if (tipoProjeto) tipoProjeto.addEventListener("change", calcularTotal);
extras.forEach((extra) => extra.addEventListener("change", calcularTotal));
calcularTotal();

