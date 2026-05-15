/* ============================================================
   SECCIÓN 13 — RESILIENCIA SOCIAL
   Mochila checklist, plan familiar PDF (jsPDF), simulacros, quiz
   ============================================================ */
window.RR = window.RR || {}; RR.sectionInit = RR.sectionInit || {};

RR.sectionInit.resiliencia = () => {
  initMochila();
  initPlanFamiliar();
  initSimulacros();
  initQuiz();
};

function initMochila() {
  const ul = document.getElementById('mochilaChecklist');
  const progress = document.getElementById('mochilaProgress');
  const count = document.getElementById('mochilaCount');
  if (!ul) return;
  const saved = JSON.parse(localStorage.getItem('rr-mochila') || '[]');

  ul.innerHTML = RR.data.mochilaItems.map((item, i) => `
    <li data-i="${i}">
      <input type="checkbox" id="mch-${i}" ${saved.includes(i) ? 'checked' : ''} />
      <label for="mch-${i}">${item}</label>
    </li>`).join('');

  const update = () => {
    const checks = ul.querySelectorAll('input[type="checkbox"]');
    const done = [...checks].filter(c => c.checked).length;
    const total = checks.length;
    progress.style.width = `${(done / total * 100)}%`;
    count.textContent = `${done} / ${total} elementos`;
    localStorage.setItem('rr-mochila', JSON.stringify(
      [...checks].map((c, i) => c.checked ? i : null).filter(x => x !== null)
    ));
    ul.querySelectorAll('li').forEach(li => {
      li.classList.toggle('done', li.querySelector('input').checked);
    });
  };
  ul.addEventListener('change', update);
  update();
}

function initPlanFamiliar() {
  const form = document.getElementById('planForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (typeof window.jspdf === 'undefined') {
      alert('No se pudo cargar jsPDF. Revisa tu conexión.');
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const familia = document.getElementById('planFamilia').value || 'Familia';
    const direccion = document.getElementById('planDireccion').value || '—';
    const pe1 = document.getElementById('planPE1').value || '—';
    const pe2 = document.getElementById('planPE2').value || '—';
    const contacto = document.getElementById('planContacto').value || '—';
    const med = document.getElementById('planMed').value || '—';

    doc.setFontSize(20);
    doc.setTextColor(200, 16, 46);
    doc.text('Plan Familiar de Emergencia', 20, 22);
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(familia, 20, 30);
    doc.setLineWidth(0.3);
    doc.line(20, 33, 190, 33);

    let y = 44;
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(13);
    doc.text('📍 Dirección', 20, y); y += 6;
    doc.setFontSize(10); doc.text(direccion, 24, y); y += 10;

    doc.setFontSize(13); doc.text('🟢 Puntos de encuentro', 20, y); y += 6;
    doc.setFontSize(10);
    doc.text(`1. ${pe1}`, 24, y); y += 5;
    doc.text(`2. (fuera del distrito) ${pe2}`, 24, y); y += 10;

    doc.setFontSize(13); doc.text('📞 Contacto fuera de zona', 20, y); y += 6;
    doc.setFontSize(10); doc.text(contacto, 24, y); y += 10;

    doc.setFontSize(13); doc.text('💊 Medicación crítica', 20, y); y += 6;
    doc.setFontSize(10);
    const medLines = doc.splitTextToSize(med, 165);
    doc.text(medLines, 24, y); y += medLines.length * 5 + 6;

    doc.setFontSize(13); doc.text('🆘 Números de emergencia', 20, y); y += 6;
    doc.setFontSize(10);
    [['105', 'Policía Nacional'], ['106', 'SAMU'], ['115', 'INDECI'], ['116', 'Bomberos'], ['100', 'Línea Mujer']]
      .forEach(([num, lbl]) => { doc.text(`• ${num} — ${lbl}`, 24, y); y += 5; });

    y += 6;
    doc.setFontSize(13); doc.text('✅ Antes de un sismo', 20, y); y += 6;
    doc.setFontSize(9);
    ['Identifica zonas seguras (junto a columnas).',
     'Prepara mochila de emergencia.',
     'Practica simulacros 2 veces al año.',
     'Si vives en costa, conoce ruta a cota ≥ 30 m.'].forEach(l => { doc.text('• ' + l, 24, y); y += 5; });

    y = Math.min(y + 4, 270);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('Generado en unimauro.github.io/unimaurox-peru-riesgos — Riesgos & Resiliencia del Perú', 20, 285);

    doc.save(`plan-familiar-${familia.replace(/\s+/g,'-').toLowerCase()}.pdf`);
  });
}

function initSimulacros() {
  const list = document.getElementById('simulacrosList');
  if (!list || list.children.length) return;
  list.innerHTML = RR.data.simulacros.map(s => {
    const d = new Date(s.fecha);
    const f = d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
    return `<li><strong>${f}</strong> · ${s.nombre}</li>`;
  }).join('');
}

function initQuiz() {
  const c = document.getElementById('quizContainer');
  if (!c || c.children.length) return;
  c.innerHTML = RR.data.quiz.map((q, i) => `
    <div class="quiz-q" data-i="${i}">
      <strong>${i+1}. ${q.q}</strong>
      <div class="opts">
        ${q.opts.map(([lbl, val], j) => `
          <label><input type="radio" name="q${i}" value="${val}" /> ${lbl}</label>
        `).join('')}
      </div>
    </div>
  `).join('') + `
    <button class="btn primary" id="quizBtn">Ver mi nivel de resiliencia</button>
    <div id="quizResult"></div>`;

  document.getElementById('quizBtn').addEventListener('click', () => {
    let sum = 0, max = 0;
    RR.data.quiz.forEach((q, i) => {
      max += Math.max(...q.opts.map(o => o[1]));
      const v = c.querySelector(`input[name="q${i}"]:checked`);
      if (v) sum += parseInt(v.value);
    });
    const pct = Math.round(sum / max * 100);
    let nivel, msg;
    if (pct >= 80) { nivel = '🟢 Excelente'; msg = 'Estás muy bien preparado. Ayuda a tu comunidad.'; }
    else if (pct >= 60) { nivel = '🟡 Bueno'; msg = 'Sólida base, pero hay vacíos. Refuerza lo pendiente.'; }
    else if (pct >= 35) { nivel = '🟠 Regular'; msg = 'Te falta lo básico. Empieza por la mochila y el punto de encuentro.'; }
    else { nivel = '🔴 Vulnerable'; msg = 'Si pasa algo hoy, tu familia está en riesgo. Empieza ya — esta semana.'; }
    document.getElementById('quizResult').innerHTML = `
      <div class="quiz-result">
        <h4>${pct}% · ${nivel}</h4>
        <p>${msg}</p>
        <p class="small muted">Comparte con tu familia y haz el quiz juntos.</p>
      </div>`;
    document.getElementById('quizResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
