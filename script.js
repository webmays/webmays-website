/* ============================
   WEBMAYS — script.js
   ============================ */

// Force scroll to top on page load & refresh (sempre volta para a Hero Section)
if ('scrollRestoration' in history) {
  history.scrollRestoration = "manual";
}
// Remove hash da URL no refresh para o navegador não descer automaticamente para seções
if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname + window.location.search);
}
window.scrollTo(0, 0);

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

/* --- Hamburger menu --- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  // Animate spans
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* --- FAQ accordion --- */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* --- Intersection Observer: fade-up on scroll --- */
const observerOpts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOpts);

// Apply to section cards
const animTargets = [
  '.cf-steps',
  '.servico-card',
  '.faq-item',
];
animTargets.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(32px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.05}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s`;
    fadeObserver.observe(el);
  });
});

/* --- SVG draw paths on scroll --- */
const drawObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.draw-path, .dot-pop').forEach(el => {
        el.style.animationPlayState = 'running';
      });
      drawObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.faq-doodle, .cta-doodle-svg').forEach(svg => {
  svg.querySelectorAll('.draw-path, .dot-pop').forEach(el => {
    el.style.animationPlayState = 'paused';
  });
  drawObserver.observe(svg);
});

/* --- Timeline bar trigger --- */
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, { threshold: 0.5 });

const timelineFill = document.querySelector('.timeline-fill');
if (timelineFill) {
  timelineFill.style.animationPlayState = 'paused';
  timelineObserver.observe(timelineFill);
}

/* --- Active nav link on scroll --- */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');


    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

/* --- Cursor glow effect (desktop) --- */
if (window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,87,255,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    top: 0; left: 0;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

console.log('%c Webmays ', 'background:#0057FF;color:#fff;font-size:18px;font-weight:900;padding:6px 12px;border-radius:6px;');
console.log('%c Site desenvolvido com criatividade e cafe ☕', 'color:#FF5A00;font-size:13px;');

/* --- Dynamic Tagline (Kinetic Letter-by-Letter Mask Reveal) --- */
const taglinePhrases = [
  "Sites acessíveis para você!",
  "Design moderno que converte!",
  "Sua presença digital no próximo nível!",
  "Experiências únicas para seus clientes!"
];
const taglineEl = document.getElementById('dynamic-tagline');

function splitTaglineText(element, text) {
  const words = text.split(' ');
  let html = '';
  for (let i = 0; i < words.length; i++) {
    const chars = Array.from(words[i]);
    let wordHtml = '';
    for (let j = 0; j < chars.length; j++) {
      wordHtml += '<span class="char-wrap"><span class="char-inner">' + chars[j] + '</span></span>';
    }
    html += '<span class="word-wrap">' + wordHtml + '</span>';
    if (i < words.length - 1) {
      html += ' ';
    }
  }
  element.innerHTML = html;
}

if (taglineEl) {
  let phraseIndex = 0;
  splitTaglineText(taglineEl, taglinePhrases[phraseIndex]);

  // Entrada inicial letra por letra surgindo de baixo da linha invisível
  if (typeof gsap !== 'undefined') {
    gsap.fromTo(taglineEl.querySelectorAll('.char-inner'),
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.02,
        delay: 0.45,
        ease: 'power3.out'
      }
    );
  }

  setInterval(() => {
    if (typeof gsap === 'undefined') return;

    const currentChars = taglineEl.querySelectorAll('.char-inner');
    // 1. As letras sobem sem ultrapassar a linha invisível (saem cortadas pela borda superior)
    gsap.to(currentChars, {
      yPercent: -110,
      opacity: 0,
      duration: 0.38,
      stagger: 0.012,
      ease: 'power2.in',
      onComplete: () => {
        phraseIndex = (phraseIndex + 1) % taglinePhrases.length;
        splitTaglineText(taglineEl, taglinePhrases[phraseIndex]);
        const nextChars = taglineEl.querySelectorAll('.char-inner');

        // 2. Cada letrinha vai saindo de uma linha invisível abaixo delas (entram cortadas pela borda inferior)
        gsap.fromTo(nextChars,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.02,
            ease: 'power3.out'
          }
        );
      }
    });
  }, 4800);
}

/* =========================================================================
   ESCORRIMENTOS DE TINTA LÍQUIDA REAL (SVG ORGÂNICO + SCROLLTRIGGER)
   - Tinta que escorre, afina, forma protuberâncias e termina em gota em lágrima
   - Shapes SVG fechados com variação de espessura e filtro feTurbulence
   - Controlado via ScrollTrigger revelando a tinta descendo com o scroll
   ========================================================================= */

/* ============================
   GSAP & ScrollTrigger: Sobre Nós → Projetos (Parallax Slide-Over)
   ============================ */
function initGsapEffects() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Navbar ScrollTrigger
  ScrollTrigger.create({
    start: "top -20",
    toggleClass: { targets: "#navbar", className: "scrolled" }
  });

  // Inicialização do Lenis (Smooth Scroll com física de inércia fluida)
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.8,
      infinite: false,
    });

    // Garante que o Lenis inicie cravado no topo absoluto (Hero Section)
    lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Rolagem suave para links de âncoras internas (#sobre, #projetos, etc.)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl, { offset: 0, duration: 1.2 });
          }
        }
      });
    });
  }

  const sobre = document.querySelector('#sobre');
  const projetos = document.querySelector('#projetos');
  const cards = gsap.utils.toArray('.projeto-row');

  if (!sobre || !projetos) return;

  const mm = gsap.matchMedia();

  // Desktop & Tablet (> 768px): Folha sobreposta com Parallax de profundidade
  mm.add("(min-width: 769px)", () => {
    // 1. Fixa "Sobre nós" no final da garota no círculo laranja até que "Projetos" suba e o cubra por completo
    ScrollTrigger.create({
      trigger: sobre,
      start: 'bottom bottom',
      endTrigger: projetos,
      end: 'top top',
      pin: true,
      pinSpacing: false
    });

    // 2. Parallax de profundidade em Sobre nós com amortecimento (scrub suave: 1.2s)
    gsap.to('#sobre .container', {
      yPercent: -12,
      scale: 0.94,
      opacity: 0.35,
      ease: 'none',
      scrollTrigger: {
        trigger: projetos,
        start: 'top bottom',
        end: 'top top',
        scrub: 1.2
      }
    });

    // 2.1 Efeito parallax suave na personagem feminina
    gsap.to('.sobre-novo-char', {
      xPercent: -50,
      y: -25,
      ease: 'none',
      scrollTrigger: {
        trigger: projetos,
        start: 'top bottom',
        end: 'top top',
        scrub: 1.5
      }
    });

    // 3. Título PROJETOS: preenchimento líquido laranja da esquerda para a direita,
    // e fica laranja direto
    const liquidOverlay = document.querySelector('.liquid-title-overlay');
    if (liquidOverlay) {
      const titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#projetos',
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });

      titleTl
        .set(liquidOverlay, { clipPath: 'inset(0 100% 0 0)' })
        // Fase 1: Avança laranja da esquerda para a direita
        .to(liquidOverlay, {
          clipPath: 'inset(0 0% 0 0%)',
          duration: 1.15,
          ease: 'power2.inOut'
        });
    }

    // 4. Efeito fluido nos 4 cards de Projetos (stagger refinado + scale)
    gsap.from(cards, {
      y: 85,
      opacity: 0,
      scale: 0.94,
      duration: 1.1,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.projetos-list',
        start: 'top 82%',
        toggleActions: 'play none none reverse'
      }
    });

    // 5. Brilho sequencial nos números (01 a 04) e depois fade para cinza suave
    const numberEls = gsap.utils.toArray('.projeto-index');
    if (numberEls.length > 0) {
      const numTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.projetos-list',
          start: 'top 80%',
          toggleActions: 'restart none none none'
        }
      });

      numberEls.forEach((numEl, i) => {
        numTl
          .to(numEl, {
            color: '#FF5A00',
            scale: 1.2,
            duration: 0.35,
            ease: 'power2.out'
          }, i * 0.22)
          .to(numEl, {
            color: 'rgba(0, 0, 0, 0.1)',
            scale: 1,
            duration: 0.45,
            ease: 'power2.inOut',
            clearProps: 'color,scale'
          }, (i * 0.22) + 0.35);
      });
    }
  });

  // Mobile (<= 768px): Transição Parallax no final da garota no círculo laranja
  mm.add("(max-width: 768px)", () => {
    // 1. Fixa "Sobre nós" no final da garota no círculo laranja até que "Projetos" suba e o cubra por completo (igual ao desktop)
    ScrollTrigger.create({
      trigger: sobre,
      start: 'bottom bottom',
      endTrigger: projetos,
      end: 'top top',
      pin: true,
      pinSpacing: false
    });

    // 2. Parallax de profundidade em Sobre nós com amortecimento (scrub suave: 1.2s)
    gsap.to('#sobre .container', {
      yPercent: -8,
      scale: 0.95,
      opacity: 0.4,
      ease: 'none',
      scrollTrigger: {
        trigger: projetos,
        start: 'top bottom',
        end: 'top top',
        scrub: 1.2
      }
    });

    // 2.1 Efeito parallax suave na personagem feminina
    gsap.to('.sobre-novo-char', {
      xPercent: -50,
      y: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: projetos,
        start: 'top bottom',
        end: 'top top',
        scrub: 1.5
      }
    });

    // Título líquido no mobile
    const liquidOverlayMob = document.querySelector('.liquid-title-overlay');
    if (liquidOverlayMob) {
      const titleTlMob = gsap.timeline({
        scrollTrigger: {
          trigger: '#projetos',
          start: 'top 78%',
          toggleActions: 'play none none none'
        }
      });

      titleTlMob
        .set(liquidOverlayMob, { clipPath: 'inset(0 100% 0 0)' })
        .to(liquidOverlayMob, {
          clipPath: 'inset(0 0% 0 0%)',
          duration: 1.1,
          ease: 'power2.inOut'
        });
    }

    gsap.from(cards, {
      y: 40,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.projetos-list',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    });
  });

    // 6. Manchas e Pingos de Tinta Real — Impacto Orgânico (Splat) e Escorrimento Dinâmico
    const topSplashes = gsap.utils.toArray('.splash-top');
    const bottomSplashes = gsap.utils.toArray('.splash-bottom');
    const paintDrips = gsap.utils.toArray('.paint-drip');

    // Splashes superiores: impacto de tinta vigoroso com leve recoil rotacional
    topSplashes.forEach((splash, i) => {
      gsap.fromTo(splash,
        { scale: 0.1, opacity: 0, rotation: i === 0 ? -28 : 22 },
        {
          scale: 1,
          opacity: 1,
          rotation: i === 0 ? -12 : 38,
          duration: 0.85,
          delay: 0.08 + i * 0.16,
          ease: 'back.out(1.8)',
          scrollTrigger: {
            trigger: '#projetos',
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Splashes inferiores: ativam quando o usuário rola até os cards, surgindo ao vivo na tela
    bottomSplashes.forEach((splash, i) => {
      gsap.fromTo(splash,
        { scale: 0.12, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.85,
          delay: i * 0.14,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.projetos-list',
            start: 'top 65%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Drips: escorrem em sincronia quando o usuário alcança a base da seção
    paintDrips.forEach((drip, i) => {
      drip.style.transitionDelay = `${0.2 + i * 0.22}s`;

      const st = ScrollTrigger.create({
        trigger: '.projetos-list',
        start: 'top 65%',
        onEnter: () => drip.classList.add('drip-reveal'),
        onRefresh: (self) => {
          if (self.progress > 0) drip.classList.add('drip-reveal');
        }
      });

      ScrollTrigger.create({
        trigger: '#como-funciona',
        start: 'top 95%',
        onEnter: () => drip.classList.add('drip-reveal')
      });

      if (st && st.progress > 0) {
        drip.classList.add('drip-reveal');
      }
    });

  ScrollTrigger.refresh();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGsapEffects);
} else {
  initGsapEffects();
}

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  if (typeof lenis !== 'undefined' && lenis) {
    lenis.scrollTo(0, { immediate: true });
  }
  ScrollTrigger.refresh();
});

/* --- Mobile Carousel Active Card (Intersection Observer) --- */
const carouselObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // Quando o card atinge pelo menos 60% de visibilidade na tela
    if (entry.isIntersecting) {
      entry.target.classList.add('snap-active');
    } else {
      entry.target.classList.remove('snap-active');
    }
  });
}, {
  root: document.querySelector('.projetos-list'),
  threshold: 0.6
});

document.querySelectorAll('.projeto-row').forEach(card => {
  carouselObserver.observe(card);
});

/* ==========================================================================
   COMO FUNCIONA - TRANSIÇÃO INTELIGENTE (PULA INTERMEDIÁRIOS & NÃO-BLOQUEANTE)
   ========================================================================== */
const cfNavNums = document.querySelectorAll('.cf-nav-num');
const cfFeatureCards = document.querySelectorAll('.cf-feature-card');
const cfOverlay = document.querySelector('.cf-transition-overlay');

// Estado inicial: overlay inclinado e fora da visão à direita
if (cfOverlay) {
  gsap.set(cfOverlay, { skewX: -12, xPercent: 110, autoAlpha: 0 });
}

let cfTimeline = null;
let currentActiveId = '01'; // O card atualmente visível
let activeTargetId = '01';  // O card que será revelado na fase atual
let queuedTargetId = null;  // Card na fila se o clique ocorrer após a troca de conteúdo

function triggerCardTransition(targetId) {
  activeTargetId = targetId;
  queuedTargetId = null;

  // Atualiza botões
  cfNavNums.forEach(num => num.classList.toggle('active', num.getAttribute('data-target') === targetId));

  let hasSwapped = false;

  cfTimeline = gsap.timeline({
    onComplete: () => {
      currentActiveId = activeTargetId;
      cfTimeline = null;
      gsap.set(cfOverlay, { autoAlpha: 0, xPercent: 110 });

      // Se um novo card foi clicado enquanto o overlay já estava saindo, transiciona para ele agora
      if (queuedTargetId && queuedTargetId !== currentActiveId) {
        const next = queuedTargetId;
        queuedTargetId = null;
        triggerCardTransition(next);
      }
    }
  });

  // 1. Overlay varre da direita até o centro cobrindo 100% do card (~0.32s)
  cfTimeline.fromTo(cfOverlay,
    { xPercent: 110, autoAlpha: 1, skewX: -12 },
    { xPercent: 0, duration: 0.32, ease: 'power2.in' }
  );

  // 2. No ponto exato de cobertura máxima (xPercent: 0):
  // Troca SEMPRE para o activeTargetId mais recente! Se o usuário clicou em outros no meio do caminho,
  // ele vai direto para o último sem nunca parar ou exibir o intermediário.
  cfTimeline.add(() => {
    hasSwapped = true;
    const finalCard = document.getElementById(`card-${activeTargetId}`);
    if (finalCard) {
      cfFeatureCards.forEach(c => c.classList.remove('active'));
      finalCard.classList.add('active');
      currentActiveId = activeTargetId;
    }
  });

  // 3. Overlay varre para a esquerda revelando o card final (~0.32s)
  cfTimeline.to(cfOverlay, {
    xPercent: -110,
    duration: 0.32,
    ease: 'power2.out'
  });

  // Helper para saber se a troca sob o overlay já ocorreu
  cfTimeline.hasSwapped = () => hasSwapped;
}

cfNavNums.forEach(navNum => {
  navNum.addEventListener('click', () => {
    const targetId = navNum.getAttribute('data-target');

    // Se já é o card ativo e nenhuma transição está ocorrendo ou na fila, ignora
    if (targetId === currentActiveId && (!cfTimeline || !cfTimeline.isActive()) && !queuedTargetId) {
      return;
    }

    // Feedback visual imediato na aba clicada sempre
    cfNavNums.forEach(num => num.classList.toggle('active', num.getAttribute('data-target') === targetId));

    // Se a animação já estiver rodando:
    if (cfTimeline && cfTimeline.isActive()) {
      // Se o overlay ainda está entrando (cobrindo o card) e ainda NÃO trocou o conteúdo:
      if (!cfTimeline.hasSwapped()) {
        // Redireciona a troca diretamente para o último clicado!
        // Não para no intermediário e não recomeça a animação!
        activeTargetId = targetId;
        queuedTargetId = null;
      } else {
        // Se o overlay já atingiu o centro e já está saindo, agenda para rodar logo após sair
        queuedTargetId = targetId;
      }
      return;
    }

    // Se estiver ocioso, inicia a transição imediatamente
    triggerCardTransition(targetId);
  });
});

/* ==========================================================================
   SERVIÇOS — MODAL DE ORÇAMENTO (WHATSAPP) & CARROSSEL MOBILE CENTRALIZADO
   ========================================================================== */

(function initServicosInteractions() {
  // 1. Elementos do Modal
  const serviceModal = document.getElementById('service-modal');
  const modalBadgeName = document.getElementById('modal-badge-name');
  const modalBadgePrice = document.getElementById('modal-badge-price');
  const serviceSelect = document.getElementById('form-service-select');
  const quoteForm = document.getElementById('service-quote-form');
  const clientNameInput = document.getElementById('form-client-name');
  const businessNameInput = document.getElementById('form-business-name');
  const clientPhoneInput = document.getElementById('form-client-phone');
  const clientNotesInput = document.getElementById('form-client-notes');

  // Mapeamento de Serviços e Preços
  const SERVICE_PRICES = {
    'Página promocional simples': 'R$ 390,90',
    'Página promocional completa': 'R$ 499,90',
    'Site institucional': 'Valor por página',
    'Loja virtual': 'Sob consulta',
    'Portfólio': 'R$ 250,00',
    'Manutenção de Website': 'Via orçamento',
    'Manutenção': 'Via orçamento'
  };

  // Abre o modal preenchendo o serviço solicitado
  function openServiceModal(serviceName, servicePrice) {
    if (!serviceModal) return;

    const matchedPrice = servicePrice || SERVICE_PRICES[serviceName] || 'Sob consulta';

    if (modalBadgeName) modalBadgeName.textContent = serviceName;
    if (modalBadgePrice) modalBadgePrice.textContent = matchedPrice;

    // Sincroniza o select do formulário
    if (serviceSelect) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        const opt = serviceSelect.options[i];
        if (opt.value.toLowerCase().includes(serviceName.toLowerCase()) || 
            serviceName.toLowerCase().includes(opt.text.toLowerCase().split('—')[0].trim())) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }

    serviceModal.classList.add('is-open');
    serviceModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Foca suavemente no primeiro campo
    setTimeout(() => {
      if (clientNameInput) clientNameInput.focus();
    }, 150);
  }

  // Fecha o modal
  function closeServiceModal() {
    if (!serviceModal) return;
    serviceModal.classList.remove('is-open');
    serviceModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Eventos de clique para abrir o modal em todos os botões de serviço (inclusive Manutenção)
  document.querySelectorAll('[data-service-name]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service-name') || 'Página promocional completa';
      const servicePrice = btn.getAttribute('data-service-price') || '';
      openServiceModal(serviceName, servicePrice);
    });
  });

  // Fechar ao clicar no overlay ou no botão de fechar (data-modal-close)
  document.querySelectorAll('[data-modal-close]').forEach(closer => {
    closer.addEventListener('click', (e) => {
      e.preventDefault();
      closeServiceModal();
    });
  });

  // Fechar com tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceModal && serviceModal.classList.contains('is-open')) {
      closeServiceModal();
    }
  });

  // Atualizar badges quando o usuário troca o select manualmente
  if (serviceSelect) {
    serviceSelect.addEventListener('change', () => {
      const selectedText = serviceSelect.options[serviceSelect.selectedIndex].text;
      const parts = selectedText.split('—');
      const cleanName = parts[0].trim();
      const cleanPrice = parts[1] ? parts[1].replace('(Mais escolhida)', '').trim() : 'Sob consulta';

      if (modalBadgeName) modalBadgeName.textContent = cleanName;
      if (modalBadgePrice) modalBadgePrice.textContent = cleanPrice;
    });
  }

  // Máscara brasileira para telefone/WhatsApp: (XX) XXXXX-XXXX
  if (clientPhoneInput) {
    clientPhoneInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 6) {
        e.target.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
      } else if (v.length > 2) {
        e.target.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
      } else if (v.length > 0) {
        e.target.value = `(${v}`;
      }
    });
  }

  // Envio do formulário para o WhatsApp Webmays
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = clientNameInput ? clientNameInput.value.trim() : '';
      const business = businessNameInput && businessNameInput.value.trim() ? businessNameInput.value.trim() : 'Não informado';
      const phone = clientPhoneInput ? clientPhoneInput.value.trim() : '';
      const selectedService = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text : 'Website Webmays';
      const notes = clientNotesInput && clientNotesInput.value.trim() ? clientNotesInput.value.trim() : 'Gostaria de mais detalhes sobre este serviço.';

      if (!name || !phone) {
        alert('Por favor, preencha seu nome e seu WhatsApp.');
        return;
      }

      // Monta a mensagem estruturada e elegante para WhatsApp
      const waMessage = 
`🚀 *Solicitação de Orçamento — Webmays*

👤 *Nome:* ${name}
🏢 *Negócio / Projeto:* ${business}
📱 *WhatsApp:* ${phone}
💼 *Serviço Escolhido:* ${selectedService}
📝 *Detalhes:* ${notes}

---
_Enviado pelo formulário de serviços da Webmays_`;

      // Número do WhatsApp da Webmays (caso não haja número configurado, abre direto no wa.me com a mensagem)
      const webmaysPhone = '5511999999999'; // Substituir pelo número comercial oficial se necessário
      const waUrl = `https://wa.me/${webmaysPhone}?text=${encodeURIComponent(waMessage)}`;

      window.open(waUrl, '_blank');

      // Fecha o modal e limpa os campos
      closeServiceModal();
      quoteForm.reset();
    });
  }

  // 2. Carrossel Mobile Centralizado (.servicos-grid)
  // O card central fica ampliado (scale: 1.02) e os laterais encolhidos (scale: 0.88)
  const servicosGrid = document.querySelector('.servicos-grid');
  const servicoCards = document.querySelectorAll('.servicos-grid .servico-card');

  if (servicosGrid && servicoCards.length > 0) {
    function scrollToServiceCard(card, behavior = 'smooth') {
      const cardRect = card.getBoundingClientRect();
      const gridRect = servicosGrid.getBoundingClientRect();
      const targetScrollLeft = servicosGrid.scrollLeft + (cardRect.left + cardRect.width / 2) - (gridRect.left + gridRect.width / 2);
      servicosGrid.scrollTo({
        left: targetScrollLeft,
        behavior: behavior
      });
    }

    function updateActiveServiceCard() {
      // Ativo apenas em telas mobile / tablet (largura <= 1200px)
      if (window.innerWidth > 1200) {
        servicoCards.forEach(card => card.classList.remove('is-active-center', 'is-prev-card', 'is-next-card'));
        return;
      }

      const gridRect = servicosGrid.getBoundingClientRect();
      const gridCenter = gridRect.left + gridRect.width / 2;

      let closestCard = null;
      let minDistance = Infinity;

      servicoCards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const dist = Math.abs(gridCenter - cardCenter);

        if (dist < minDistance) {
          minDistance = dist;
          closestCard = card;
        }
      });

      const closestIndex = Array.from(servicoCards).indexOf(closestCard);
      servicoCards.forEach((card, idx) => {
        card.classList.remove('is-active-center', 'is-prev-card', 'is-next-card');
        if (idx === closestIndex) {
          card.classList.add('is-active-center');
        } else if (idx < closestIndex) {
          card.classList.add('is-prev-card');
        } else {
          card.classList.add('is-next-card');
        }
      });
    }

    // Listener com debounce via requestAnimationFrame para performance 60fps
    let ticking = false;
    servicosGrid.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveServiceCard();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', updateActiveServiceCard, { passive: true });

    // Ao clicar em um card lateral (atrás), centraliza-o suavemente sem scroll vertical
    servicoCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (window.innerWidth <= 1200 && !card.classList.contains('is-active-center')) {
          if (!e.target.closest('.btn-servico-cta')) {
            e.preventDefault();
            scrollToServiceCard(card, 'smooth');
          }
        }
      });
    });

    // Estado inicial no mobile: centraliza perfeitamente no card em destaque
    setTimeout(() => {
      if (window.innerWidth <= 1200) {
        const featuredCard = document.querySelector('.servico-card--featured') || servicoCards[0];
        if (featuredCard) {
          scrollToServiceCard(featuredCard, 'auto');
          updateActiveServiceCard();
        }
      }
    }, 250);
  }
})();

