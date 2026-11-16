document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. INJEÇÃO AUTOMÁTICA DO MODAL DE AVISO INFORMATIVO & BANNER DE COOKIES
  // =========================================================================
  const initGovernanceUI = () => {
    // Injeta o Modal de Confirmação de Leitura e Termos de Serviço
    const modalHTML = `
      <div class="modal-overlay" id="disclaimer-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-box">
          <div class="modal-header">
            <span style="font-size: 1.5rem;">🛡️</span>
            <h2 id="modal-title">Aviso Informativo e Termos de Uso</h2>
          </div>
          <div class="modal-body">
            <p>
              Bem-vindo(a) ao portal <strong>Enf.ª Letícia FarmaComp</strong>. Antes de continuar, leia atentamente as condições de uso deste ambiente educacional:
            </p>
            <div class="terms-scroll-box">
              <h4>1. Caráter Estritamente Educativo e Ilustrativo</h4>
              <p>Todo o conteúdo textual, gráfico e interativo (incluindo o simulador de protocolos) tem finalidade exclusivamente informativa e acadêmica, baseado em diretrizes públicas da Organização Mundial da Saúde (OMS).</p>
              
              <h4>2. Ausência de Aconselhamento ou Prescrição Médica</h4>
              <p>Este portal não realiza diagnósticos, não prescreve medicamentos e não substitui a avaliação presencial de profissionais de saúde habilitados.</p>
              
              <h4>3. Conformidade Legal e Segurança</h4>
              <p>O portal incentiva o cumprimento rigoroso da legislação vigente e orienta a busca por serviços oficiais e legais de saúde pública (SUS) e canais institucionais de acolhimento.</p>
              
              <h4>4. Privacidade e Armazenamento Local</h4>
              <p>Nenhuma informação inserida nas ferramentas interativas é enviada a servidores externos; todos os cálculos ocorrem localmente no seu navegador.</p>
            </div>

            <label class="checkbox-confirm" for="accept-terms-checkbox">
              <input type="checkbox" id="accept-terms-checkbox">
              <span>Declaro que li e compreendi que este site possui caráter meramente ilustrativo e informativo, concordando com os Termos de Serviço.</span>
            </label>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="confirm-terms-btn" disabled>
              Confirmar Leitura e Acessar Portal
            </button>
          </div>
        </div>
      </div>
    `;

    // Injeta o Banner de Consentimento de Cookies
    const cookieHTML = `
      <div class="cookie-banner" id="cookie-banner" role="region" aria-label="Aviso de Cookies">
        <div class="cookie-text">
          <h4>🍪 Preferências de Privacidade e Cookies</h4>
          <p>Utilizamos armazenamento local essencial para registrar sua confirmação de leitura e garantir a navegação segura e anônima neste portal educativo.</p>
        </div>
        <div class="cookie-actions">
          <button type="button" class="btn btn-outline btn-sm" id="cookie-essential-btn">Apenas Essenciais</button>
          <button type="button" class="btn btn-primary btn-sm" id="cookie-accept-btn">Aceitar Todos</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML + cookieHTML);

    const modal = document.getElementById('disclaimer-modal');
    const checkbox = document.getElementById('accept-terms-checkbox');
    const confirmBtn = document.getElementById('confirm-terms-btn');
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept-btn');
    const cookieEssentialBtn = document.getElementById('cookie-essential-btn');

    const hasAcceptedTerms = localStorage.getItem('infosaude_terms_accepted') === 'true';
    const hasSetCookies = localStorage.getItem('infosaude_cookie_consent');

    const showCookieBannerIfNeeded = () => {
      if (!localStorage.getItem('infosaude_cookie_consent')) {
        setTimeout(() => {
          cookieBanner.classList.add('show');
        }, 400);
      }
    };

    // Exibe o modal obrigatoriamente no primeiro acesso
    if (!hasAcceptedTerms) {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
    } else if (!hasSetCookies) {
      showCookieBannerIfNeeded();
    }

    // Habilita o botão apenas quando a caixa de seleção estiver marcada
    checkbox.addEventListener('change', () => {
      confirmBtn.disabled = !checkbox.checked;
    });

    // Confirmação do Modal de Termos
    confirmBtn.addEventListener('click', () => {
      localStorage.setItem('infosaude_terms_accepted', 'true');
      localStorage.setItem('infosaude_terms_date', new Date().toISOString());
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
      showCookieBannerIfNeeded();
    });

    // Ações do Banner de Cookies
    const saveCookiePreference = (level) => {
      localStorage.setItem('infosaude_cookie_consent', level);
      cookieBanner.classList.remove('show');
    };

    cookieAcceptBtn.addEventListener('click', () => saveCookiePreference('all'));
    cookieEssentialBtn.addEventListener('click', () => saveCookiePreference('essential'));

    // Botões no rodapé para reabrir Termos ou Cookies a qualquer momento
    document.querySelectorAll('[data-open-terms]').forEach(btn => {
      btn.addEventListener('click', () => {
        checkbox.checked = localStorage.getItem('infosaude_terms_accepted') === 'true';
        confirmBtn.disabled = !checkbox.checked;
        modal.classList.add('active');
        document.body.classList.add('modal-open');
      });
    });

    document.querySelectorAll('[data-open-cookies]').forEach(btn => {
      btn.addEventListener('click', () => {
        cookieBanner.classList.add('show');
      });
    });
  };

  initGovernanceUI();

  // =========================================================================
  // 2. MENU MOBILE RESPONSIVO
  // =========================================================================
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // =========================================================================
  // 3. ANIMAÇÃO SUAVE DE ENTRADA DOS CARDS AO ROLAR A PÁGINA
  // =========================================================================
  const cards = document.querySelectorAll('.card');
  if (cards.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    cards.forEach(card => observer.observe(card));
  }

  // =========================================================================
  // 4. CONTROLE DAS ABAS (TABS) EM protocolos.html
  // =========================================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetEl = document.getElementById(`tab-${target}`);
      if (targetEl) targetEl.classList.add('active');
    });
  });

  // =========================================================================
  // 5. CONTROLE DO ACORDEÃO (FAQ)
  // =========================================================================
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // =========================================================================
  // 6. LÓGICA DO SIMULADOR EDUCATIVO (calculadora.html)
  // =========================================================================
  const weeksRange = document.getElementById('weeks-range');
  const weeksDisplay = document.getElementById('weeks-display');
  const protoButtons = document.querySelectorAll('.proto-btn');
  const resultTag = document.getElementById('result-tag');
  const resultTitle = document.getElementById('result-title');
  const resultSteps = document.getElementById('result-steps');
  const pillSummary = document.getElementById('pill-summary');

  if (weeksRange && resultSteps) {
    let selectedProtocol = 'combinado';

    const updateSimulator = () => {
      const weeks = parseInt(weeksRange.value, 10);
      weeksDisplay.textContent = `${weeks} semanas`;

      if (selectedProtocol === 'combinado') {
        resultTag.textContent = `${weeks} Semanas • Protocolo Combinado (OMS)`;
        resultTitle.textContent = 'Esquema Combinado: Mifepristona + Misoprostol';

        const extraDoseNote = weeks >= 10
          ? `<div class="step-card">
               <h4>Etapa 3 (Observação Clínica para 10–12 semanas)</h4>
               <p>Em gestações entre 10 e 12 semanas, diretrizes clínicas apontam que pode ser necessária uma dose adicional de <strong>400 mcg de Misoprostol (2 comprimidos)</strong> após 4 horas, caso não haja resposta completa.</p>
             </div>`
          : '';

        resultSteps.innerHTML = `
          <div class="step-card">
            <h4>Etapa 1 — Dia 1: Mifepristona (200 mg)</h4>
            <p>1 comprimido de <strong>200 mg por via oral</strong>. Prepara o útero e bloqueia a ação da progesterona.</p>
          </div>
          <div class="step-card">
            <h4>Etapa 2 — Após 24h a 48h: Misoprostol (800 mcg)</h4>
            <p><strong>4 comprimidos de 200 mcg</strong> administrados por via sublingual (30 min sob a língua), bucal ou vaginal.</p>
          </div>
          ${extraDoseNote}
        `;

        const totalMiso = weeks >= 10 ? '4 a 6 comp. (800–1200 mcg)' : '4 comp. (800 mcg)';
        pillSummary.innerHTML = `
          <div class="pill-stat">
            <span>Mifepristona (200 mg)</span>
            <strong>1 comprimido</strong>
          </div>
          <div class="pill-stat">
            <span>Misoprostol (200 mcg)</span>
            <strong>${totalMiso}</strong>
          </div>
          <div class="pill-stat">
            <span>Suporte Analgésico</span>
            <strong>AINE + Protetor Gástrico</strong>
          </div>
        `;
      } else {
        resultTag.textContent = `${weeks} Semanas • Protocolo Isolado (OMS)`;
        resultTitle.textContent = 'Esquema Isolado: Apenas Misoprostol';

        resultSteps.innerHTML = `
          <div class="step-card">
            <h4>Dose 1 — Início: Misoprostol (800 mcg)</h4>
            <p><strong>4 comprimidos de 200 mcg</strong> por via sublingual ou vaginal.</p>
          </div>
          <div class="step-card">
            <h4>Dose 2 — Após 3 horas: Misoprostol (800 mcg)</h4>
            <p><strong>4 comprimidos de 200 mcg</strong> pela mesma via de administração.</p>
          </div>
          <div class="step-card">
            <h4>Dose 3 — Após mais 3 horas: Misoprostol (800 mcg)</h4>
            <p><strong>4 comprimidos de 200 mcg</strong> para completar o ciclo padrão de 3 doses descrito pela OMS.</p>
          </div>
        `;

        pillSummary.innerHTML = `
          <div class="pill-stat">
            <span>Mifepristona</span>
            <strong>Não utilizada</strong>
          </div>
          <div class="pill-stat">
            <span>Misoprostol (200 mcg)</span>
            <strong>12 comp. (3 doses de 800 mcg)</strong>
          </div>
          <div class="pill-stat">
            <span>Suporte Analgésico</span>
            <strong>AINE + Protetor Gástrico</strong>
          </div>
        `;
      }
    };

    weeksRange.addEventListener('input', updateSimulator);

    protoButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        protoButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedProtocol = btn.getAttribute('data-protocol');
        updateSimulator();
      });
    });

    updateSimulator();
  }
});