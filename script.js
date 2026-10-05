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

function setNavMenu(isOpen) {
  if (!navLinks || !hamburger) return;
  navLinks.classList.toggle('open', isOpen);
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
}

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    setNavMenu(!navLinks.classList.contains('open'));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setNavMenu(false));
  });
}

/* --- FAQ accordion (Motion-Primitives Style) --- */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');

    // Close all items
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      const q = i.querySelector('.faq-question');
      if (q) q.setAttribute('aria-expanded', 'false');
    });

    // Toggle current item
    if (!wasOpen) {
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

/* --- Seção Serviços: Todos os cards aparecem juntos ao chegar na seção (e não individualmente conforme o scroll) --- */
const servicosSection = document.querySelector('#servicos');
if (servicosSection) {
  const servCards = servicosSection.querySelectorAll('.servico-card');
  servCards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(28px)';
    card.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s`;
  });

  const servicosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        servCards.forEach((card, i) => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
          // Limpa inline transform, transition e opacity após animação para permitir livre funcionamento do hover no CSS e do carrossel mobile
          setTimeout(() => {
            card.style.transform = '';
            card.style.transition = '';
            card.style.opacity = '';
          }, 700 + i * 60);
        });
        servicosObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

  servicosObserver.observe(servicosSection);
}

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

/* --- Active nav link & logo on scroll --- */
const navLogo = document.getElementById('nav-logo');
const navLinksList = document.querySelectorAll('.nav-link');
const trackedSectionIds = ['faq', 'servicos', 'como-funciona', 'projetos', 'sobre', 'home'];
const trackedSections = trackedSectionIds
  .map(id => ({ id, el: document.getElementById(id) }))
  .filter(item => item.el !== null);

function setActiveNav(activeId) {
  if (navLogo) {
    navLogo.classList.toggle('active', activeId === 'home');
  }
  navLinksList.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === `#${activeId}`);
  });
}

function updateNavActive() {
  const scrollY = window.scrollY || window.pageYOffset || 0;

  // Se estiver no topo da página (Hero section)
  if (scrollY < 120) {
    setActiveNav('home');
    return;
  }

  // Se estiver no final da página (FAQ/rodapé)
  if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 60) {
    setActiveNav('faq');
    return;
  }

  // Linha de foco logo abaixo da barra de navegação (~140px)
  const navThreshold = 140;

  for (const item of trackedSections) {
    const rect = item.el.getBoundingClientRect();
    if (rect.top <= navThreshold) {
      setActiveNav(item.id);
      return;
    }
  }

  setActiveNav('home');
}

window.addEventListener('scroll', updateNavActive, { passive: true });
window.addEventListener('resize', updateNavActive, { passive: true });
updateNavActive();

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
    lenis.on('scroll', updateNavActive);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Rolagem suave e precisa para links de âncoras internas (#sobre, #projetos, etc.)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            const nav = document.querySelector('#navbar');
            const navHeight = nav ? nav.offsetHeight : 70;

            if (targetId === '#home') {
              lenis.scrollTo(0, { duration: 1.2 });
              return;
            }

            // Elementos com pin do ScrollTrigger (como #sobre) possuem um wrapper .pin-spacer
            const pinSpacer = targetEl.closest('.pin-spacer') || (targetEl.parentElement && targetEl.parentElement.classList.contains('pin-spacer') ? targetEl.parentElement : null);
            const referenceEl = pinSpacer || targetEl;

            // Calcula a coordenada vertical absoluta acumulando offsetTop estático
            let elementTop = 0;
            let curr = referenceEl;
            while (curr && curr !== document.body) {
              elementTop += curr.offsetTop;
              curr = curr.offsetParent;
            }

            if (elementTop === 0 && referenceEl !== document.body) {
              elementTop = referenceEl.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);
            }

            const targetY = Math.max(0, elementTop - navHeight);
            lenis.scrollTo(targetY, { duration: 1.2 });
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
  updateNavActive();
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

  // Custom Dropdown
  const customDropdown = document.getElementById('custom-service-dropdown');
  const dropdownTrigger = document.getElementById('custom-dropdown-trigger');
  const dropdownSelectedLabel = document.getElementById('dropdown-selected-label');
  const dropdownSelectedPrice = document.getElementById('dropdown-selected-price');
  const dropdownOptions = customDropdown ? customDropdown.querySelectorAll('.custom-dropdown-option') : [];

  // Seção de Imagens de Referência (Até 3 imagens)
  const refDropzone = document.getElementById('ref-dropzone');
  const refImagesInput = document.getElementById('ref-images-input');
  const refImagesCounter = document.getElementById('ref-images-counter');
  const refPreviewsList = document.getElementById('ref-previews-list');
  let refFiles = [];
  let refCreatedUrls = [];

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

  // Sincroniza o dropdown customizado, o select nativo e o widget de resumo
  function syncServiceSelection(serviceName, servicePrice) {
    const matchedPrice = servicePrice || SERVICE_PRICES[serviceName] || 'Sob consulta';
    let matchedOption = null;

    dropdownOptions.forEach(opt => {
      const optName = opt.getAttribute('data-name') || '';
      const optVal = opt.getAttribute('data-value') || '';

      const isMatch = optName.toLowerCase() === serviceName.toLowerCase() ||
                      optVal.toLowerCase().includes(serviceName.toLowerCase()) ||
                      serviceName.toLowerCase().includes(optName.toLowerCase());

      if (isMatch && !matchedOption) {
        matchedOption = opt;
        opt.classList.add('is-selected');
      } else {
        opt.classList.remove('is-selected');
      }
    });

    const finalName = matchedOption ? (matchedOption.getAttribute('data-name') || serviceName) : serviceName;
    const finalPrice = matchedOption ? (matchedOption.getAttribute('data-price') || matchedPrice) : matchedPrice;
    const finalValue = matchedOption ? (matchedOption.getAttribute('data-value') || '') : '';

    if (dropdownSelectedLabel) dropdownSelectedLabel.textContent = finalName;
    if (dropdownSelectedPrice) dropdownSelectedPrice.textContent = finalPrice;
    if (modalBadgeName) modalBadgeName.textContent = finalName;
    if (modalBadgePrice) modalBadgePrice.textContent = finalPrice;

    if (serviceSelect && finalValue) {
      serviceSelect.value = finalValue;
    }
  }

  // Interatividade do Custom Dropdown
  if (dropdownTrigger && customDropdown) {
    dropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = customDropdown.classList.toggle('is-active');
      dropdownTrigger.setAttribute('aria-expanded', String(isOpen));
    });

    dropdownOptions.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const optName = opt.getAttribute('data-name') || '';
        const optPrice = opt.getAttribute('data-price') || '';
        syncServiceSelection(optName, optPrice);
        customDropdown.classList.remove('is-active');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      });
    });

    // Fecha dropdown se clicar fora
    document.addEventListener('click', (e) => {
      if (customDropdown.classList.contains('is-active') && !customDropdown.contains(e.target)) {
        customDropdown.classList.remove('is-active');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Gerenciamento das Imagens de Referência
  function clearRefCreatedUrls() {
    refCreatedUrls.forEach(url => URL.revokeObjectURL(url));
    refCreatedUrls = [];
  }

  function renderRefPreviews() {
    if (!refPreviewsList || !refImagesCounter) return;

    clearRefCreatedUrls();
    refPreviewsList.innerHTML = '';

    refFiles.forEach((file, idx) => {
      const card = document.createElement('div');
      card.className = 'ref-preview-card';

      const thumbUrl = URL.createObjectURL(file);
      refCreatedUrls.push(thumbUrl);

      const sizeKb = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      card.innerHTML = `
        <img src="${thumbUrl}" alt="Referência ${idx + 1}" class="ref-preview-thumb" />
        <div class="ref-preview-details">
          <span class="ref-preview-name" title="${file.name}">${file.name}</span>
          <span class="ref-preview-size">${sizeKb}</span>
        </div>
        <button type="button" class="btn-ref-remove" data-ref-idx="${idx}" aria-label="Remover imagem ${file.name}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;

      const removeBtn = card.querySelector('.btn-ref-remove');
      if (removeBtn) {
        removeBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          refFiles.splice(idx, 1);
          renderRefPreviews();
        });
      }

      refPreviewsList.appendChild(card);
    });

    const total = refFiles.length;
    refImagesCounter.textContent = `${total}/3 adicionada${total === 1 ? '' : 's'}`;

    if (refDropzone) {
      if (total >= 3) {
        refDropzone.classList.add('is-disabled');
        if (refImagesInput) refImagesInput.disabled = true;
      } else {
        refDropzone.classList.remove('is-disabled');
        if (refImagesInput) refImagesInput.disabled = false;
      }
    }
  }

  function handleIncomingFiles(fileList) {
    if (!fileList || !fileList.length) return;
    const remaining = 3 - refFiles.length;
    if (remaining <= 0) return;

    const files = Array.from(fileList);
    const validImages = files.filter(f => f.type && f.type.startsWith('image/'));

    if (validImages.length === 0) {
      alert('Por favor, selecione apenas arquivos de imagem (PNG, JPG, WEBP).');
      return;
    }

    const toAdd = validImages.slice(0, remaining);
    refFiles = refFiles.concat(toAdd);
    renderRefPreviews();
  }

  if (refDropzone && refImagesInput) {
    refDropzone.addEventListener('click', (e) => {
      if (e.target.closest('.btn-ref-remove')) return;
      if (refFiles.length >= 3) return;
      refImagesInput.click();
    });

    refDropzone.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && refFiles.length < 3) {
        e.preventDefault();
        refImagesInput.click();
      }
    });

    refImagesInput.addEventListener('change', () => {
      handleIncomingFiles(refImagesInput.files);
      refImagesInput.value = '';
    });

    ['dragenter', 'dragover'].forEach(evName => {
      refDropzone.addEventListener(evName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (refFiles.length < 3) refDropzone.classList.add('is-dragover');
      });
    });

    ['dragleave', 'drop'].forEach(evName => {
      refDropzone.addEventListener(evName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        refDropzone.classList.remove('is-dragover');
      });
    });

    refDropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer && e.dataTransfer.files) {
        handleIncomingFiles(e.dataTransfer.files);
      }
    });
  }

  // Abre o modal preenchendo o serviço solicitado
  function openServiceModal(serviceName, servicePrice) {
    if (!serviceModal) return;

    syncServiceSelection(serviceName, servicePrice);

    serviceModal.classList.add('is-open');
    serviceModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Foca suavemente no primeiro campo
    setTimeout(() => {
      if (clientNameInput) clientNameInput.focus();
    }, 150);
  }

  // Permite chamada global para o botão secundário dos projetos
  window.openServiceModal = openServiceModal;

  // Fecha o modal
  function closeServiceModal() {
    if (!serviceModal) return;
    serviceModal.classList.remove('is-open');
    serviceModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (customDropdown) {
      customDropdown.classList.remove('is-active');
      if (dropdownTrigger) dropdownTrigger.setAttribute('aria-expanded', 'false');
    }
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

  // Sincroniza se o select oculto sofrer alteração nativa
  if (serviceSelect) {
    serviceSelect.addEventListener('change', () => {
      const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
      if (selectedOption) {
        const parts = selectedOption.text.split('—');
        const cleanName = parts[0].trim();
        const cleanPrice = parts[1] ? parts[1].replace('(Mais escolhida)', '').trim() : 'Sob consulta';
        syncServiceSelection(cleanName, cleanPrice);
      }
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
      const selectedService = dropdownSelectedLabel ? dropdownSelectedLabel.textContent.trim() : (serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text : 'Website Webmays');
      const selectedPrice = dropdownSelectedPrice ? dropdownSelectedPrice.textContent.trim() : '';
      const notes = clientNotesInput && clientNotesInput.value.trim() ? clientNotesInput.value.trim() : 'Gostaria de mais detalhes sobre este serviço.';

      if (!name || !phone) {
        alert('Por favor, preencha seu nome e seu WhatsApp.');
        return;
      }

      // Detalhes sobre referências visuais se o usuário anexou
      let refText = '';
      if (refFiles.length > 0) {
        const names = refFiles.map(f => f.name).join(', ');
        refText = `\n🖼️ *Imagens de Referência (${refFiles.length}/3):* ${names} _(vou enviar aqui no chat)_`;
      }

      // Monta a mensagem estruturada e elegante para WhatsApp
      const waMessage = 
`🚀 *Solicitação de Orçamento — Webmays*

👤 *Nome:* ${name}
🏢 *Negócio / Projeto:* ${business}
📱 *WhatsApp:* ${phone}
💼 *Serviço Escolhido:* ${selectedService}${selectedPrice ? ` (${selectedPrice})` : ''}
📝 *Detalhes:* ${notes}${refText}

---
_Enviado pelo formulário de serviços da Webmays_`;

      const webmaysPhone = '5511999999999';
      const waUrl = `https://wa.me/${webmaysPhone}?text=${encodeURIComponent(waMessage)}`;

      window.open(waUrl, '_blank');

      // Fecha o modal e limpa os campos
      closeServiceModal();
      quoteForm.reset();
      refFiles = [];
      renderRefPreviews();
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

/* --- Hero Title Magnetic Repel & Draggable Letters (Desktop Mouse Only) --- */
const heroChars = document.querySelectorAll('.hero-title .char');
const heroTitle = document.querySelector('.hero-title');
const isMobileOrTouch = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;

if (!isMobileOrTouch) {
  setTimeout(() => {
    heroChars.forEach(char => {
      char.style.animation = 'none';
      char.style.cursor = 'grab';
      char.dataset.flying = 'false';
    });
  }, 1200);

  let activeChar = null;
  let startMouseX = 0;
  let startMouseY = 0;
  let startCharX = 0;
  let startCharY = 0;

  function getTranslateXY(el) {
    const style = window.getComputedStyle(el);
    const matrix = style.transform;
    if (matrix === 'none') return { x: 0, y: 0 };
    const values = matrix.split('(')[1].split(')')[0].split(',');
    return {
      x: parseFloat(values[4]),
      y: parseFloat(values[5])
    };
  }

  // Suave repulsão magnética baseada na posição de repouso fixa dos caracteres (sem jitter)
  if (heroTitle && heroChars.length > 0) {
    heroTitle.addEventListener('pointermove', (e) => {
      if (activeChar) return;

      heroChars.forEach(char => {
        if (char.dataset.flying === 'true') return;

        const rect = char.getBoundingClientRect();
        const currentPos = getTranslateXY(char);
        // Calcula o centro de repouso desfazendo a translação atual (evita oscilação/feedback loop)
        const restCenterX = rect.left - currentPos.x + rect.width / 2;
        const restCenterY = rect.top - currentPos.y + rect.height / 2;

        const distX = e.clientX - restCenterX;
        const distY = e.clientY - restCenterY;
        const dist = Math.hypot(distX, distY);
        const maxRadius = Math.max(rect.width, rect.height) * 1.05;

        if (dist < maxRadius && dist > 0) {
          const factor = Math.pow(1 - dist / maxRadius, 1.8);
          const moveX = -(distX / dist) * factor * 10;
          const moveY = -(distY / dist) * factor * 8;
          const rotate = -(distX / dist) * factor * 4;

          char.style.transform = `translate(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px) rotate(${rotate.toFixed(2)}deg)`;
          char.style.color = '#FF5A00';
          char.style.transition = 'transform 0.2s cubic-bezier(0.2, 0.8, 0.25, 1), color 0.25s ease';
        } else {
          char.style.transform = 'translate(0px, 0px) rotate(0deg)';
          char.style.color = '';
          char.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), color 0.35s ease';
        }
      });
    });

    heroTitle.addEventListener('pointerleave', () => {
      if (activeChar) return;
      heroChars.forEach(char => {
        if (char.dataset.flying === 'true') return;
        char.style.transform = 'translate(0px, 0px) rotate(0deg)';
        char.style.color = '';
        char.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), color 0.35s ease';
      });
    });
  }

  // Interação Drag & Throw com ponteiro livre
  heroChars.forEach(char => {
    char.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      activeChar = char;
      char.dataset.flying = 'false';

      const currentPos = getTranslateXY(char);
      startCharX = currentPos.x;
      startCharY = currentPos.y;

      startMouseX = e.clientX;
      startMouseY = e.clientY;

      char.style.transition = 'none';
      char.style.color = '#FF5A00';
      char.style.cursor = 'grabbing';
      char.style.zIndex = '100';
    });
  });

  window.addEventListener('pointermove', (e) => {
    if (!activeChar) return;

    const dx = e.clientX - startMouseX;
    const dy = e.clientY - startMouseY;

    const newX = startCharX + dx;
    const newY = startCharY + dy;
    const rotate = dx * 0.05;

    activeChar.style.transform = `translate(${newX}px, ${newY}px) rotate(${rotate}deg)`;
  });

  window.addEventListener('pointerup', () => {
    if (!activeChar) return;

    activeChar.style.transition = 'transform 1.6s cubic-bezier(0.16, 1, 0.3, 1), color 1.6s ease';
    activeChar.style.transform = 'translate(0px, 0px) rotate(0deg)';
    activeChar.style.color = '';
    activeChar.style.cursor = 'grab';
    activeChar.style.zIndex = '1';

    activeChar.dataset.flying = 'true';
    const charRef = activeChar;
    setTimeout(() => {
      charRef.dataset.flying = 'false';
    }, 1600);

    activeChar = null;
  });
}

/* --- Spotlight Border para Cards de Projetos & Serviços (#FF5A00) --- */
const spotlightCardsList = document.querySelectorAll('.servico-card, .projeto-row');
spotlightCardsList.forEach(card => {
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--spot-x', `${x}px`);
    card.style.setProperty('--spot-y', `${y}px`);
    card.style.setProperty('--spot-opacity', '1');
  });

  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--spot-opacity', '0');
  });
});

/* --- Projetos Morphing Dialog (Motion-Primitives Style) --- */
const projectData = {
  "1": {
    title: "Aura Concept Store",
    subtype: "Loja Virtual Completa",
    category: "E-commerce",
    tagline: "Loja virtual de alta performance com checkout acelerado, catálogo fluido e integração com meios de pagamento.",
    gradient: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 60%, #3B82F6 100%)",
    serviceSelect: "Loja virtual (Sob consulta)",
    description: "Desenvolvimento de e-commerce moderno e responsivo, focado em alta velocidade e experiência de compra intuitiva. Integramos gateway de pagamento transparente com checkout rápido via PIX e cartão, gerador de etiquetas de envio e gestão facilitada de estoque.",
    features: [
      "Catálogo dinâmico com filtros ágeis",
      "Carrinho inteligente com recuperação",
      "Checkout transparente em 1 clique",
      "Painel administrativo intuitivo",
      "Cálculo automático de frete",
      "Design mobile-first de alta retenção"
    ],
    waText: "Olá! Gostei do projeto Aura Concept Store e gostaria de um e-commerce semelhante para meu negócio!"
  },
  "2": {
    title: "Solar Prime Energia",
    subtype: "Landing Page de Conversão",
    category: "Landing Page",
    tagline: "Página de captação com simulador de economia, carregamento ultra-rápido e roteamento direto no WhatsApp.",
    gradient: "linear-gradient(135deg, #1E293B 0%, #EA580C 50%, #FBBF24 100%)",
    serviceSelect: "Página promocional completa (R$ 499,90)",
    description: "Landing Page de alta conversão estruturada com arquitetura persuasiva para captação de clientes B2B e residenciais. Inclui simulador interativo de economia na conta de luz e roteamento inteligente de leads direto para a equipe de vendas no WhatsApp.",
    features: [
      "Simulador dinâmico de economia de energia",
      "Copywriting focado em quebra de objeções",
      "Integração instantânea com WhatsApp",
      "Formulário com validação em tempo real",
      "Pixel do Meta e Google Analytics 4",
      "Carregamento leve sem dependências pesadas"
    ],
    waText: "Olá! Gostei da Landing Page Solar Prime e gostaria de uma página focada em conversão para minha empresa!"
  },
  "3": {
    title: "Odonto Harmony",
    subtype: "Website Institucional",
    category: "Institucional",
    tagline: "Presença corporativa elegante com agendamento online de consultas, equipe médica e apresentação de tratamentos.",
    gradient: "linear-gradient(135deg, #0F172A 0%, #0369A1 50%, #38BDF8 100%)",
    serviceSelect: "Site institucional (Valor por página)",
    description: "Website institucional de padrão internacional transmitindo sofisticação, confiança e higiene. Conta com catálogo visual de especialidades odontológicas, depoimentos em vídeo de pacientes e agendamento prévio com 1 toque integrado ao WhatsApp da recepção.",
    features: [
      "Apresentação humanizada da equipe",
      "Galeria antes e depois com alta nitidez",
      "Agendamento de consultas facilitado",
      "Seção FAQ para dúvidas de pacientes",
      "Otimização completa para Google Meu Negócio",
      "Certificado SSL e conformidade LGPD"
    ],
    waText: "Olá! Vi o projeto da clínica Odonto Harmony e quero um website institucional profissional para minha empresa!"
  },
  "4": {
    title: "Bistrô & Co. Gourmet",
    subtype: "Cardápio Digital & Reservas",
    category: "Gastronomia",
    tagline: "Plataforma digital com cardápio mobile em fotos de alta definição, reservas instantâneas e identidade visual artesanal.",
    gradient: "linear-gradient(135deg, #1C1917 0%, #B45309 50%, #F59E0B 100%)",
    serviceSelect: "Página promocional simples (R$ 390,90)",
    description: "Plataforma digital para restaurante e bistrô gourmet, com cardápio interativo via QR Code e website institucional para reservas de mesas, visualização de pratos e drinks em alta resolução e informações de localização.",
    features: [
      "Cardápio digital por categorias e alérgenos",
      "Sistema de reservas diretas no WhatsApp",
      "Galeria fotográfica de alta definição",
      "Integração com Google Maps e Waze",
      "Design temático artesanal e sofisticado",
      "Zero lentidão na navegação via 4G/5G"
    ],
    waText: "Olá! Adorei o projeto Bistrô & Co. e gostaria de um cardápio digital ou site gastronômico para meu restaurante!"
  }
};

const projectDialog = document.getElementById('project-dialog');
const dialogCategory = document.getElementById('dialog-category');
const dialogProjectName = document.getElementById('dialog-project-name');
const dialogSubtype = document.getElementById('dialog-subtype');
const dialogTagline = document.getElementById('dialog-tagline');
const dialogBanner = document.getElementById('dialog-banner');
const dialogDescription = document.getElementById('dialog-description');
const dialogFeatures = document.getElementById('dialog-features');
const dialogCtaPrimary = document.getElementById('dialog-cta-primary');
const dialogCtaSecondary = document.getElementById('dialog-cta-secondary');
const dialogCtaWhatsappIcon = document.getElementById('dialog-cta-whatsapp-icon');

function openProjectDialog(projectId) {
  const p = projectData[projectId] || projectData["1"];
  if (!projectDialog) return;

  if (dialogCategory) dialogCategory.textContent = p.category;
  if (dialogProjectName) dialogProjectName.textContent = p.title;
  if (dialogSubtype) dialogSubtype.textContent = p.subtype;
  if (dialogTagline) dialogTagline.textContent = p.tagline;
  if (dialogBanner) dialogBanner.style.background = p.gradient;
  if (dialogDescription) dialogDescription.textContent = p.description;

  // Render Recursos chave
  if (dialogFeatures) {
    dialogFeatures.innerHTML = p.features.map(f => `
      <li class="dialog-feature-item">
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M4 10.5l4 4L16 5.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        <span>${f}</span>
      </li>
    `).join('');
  }

  const waUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(p.waText)}`;

  // Botão Principal: Entre em contato (WhatsApp com mensagem personalizada)
  if (dialogCtaPrimary) {
    dialogCtaPrimary.setAttribute('href', waUrl);
  }

  // Ícone WhatsApp direto
  if (dialogCtaWhatsappIcon) {
    dialogCtaWhatsappIcon.setAttribute('href', waUrl);
  }

  // Botão Secundário: Montar minha ideia (fecha o modal de projetos e abre o formulário de orçamento de serviço)
  if (dialogCtaSecondary) {
    dialogCtaSecondary.onclick = (e) => {
      e.preventDefault();
      closeProjectDialog();
      if (typeof window.openServiceModal === 'function') {
        window.openServiceModal(p.serviceSelect || 'Página promocional completa', '');
      }
    };
  }

  projectDialog.classList.add('is-open');
  projectDialog.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProjectDialog() {
  if (!projectDialog) return;
  projectDialog.classList.remove('is-open');
  projectDialog.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Event listeners para abrir o modal de projeto ao clicar no card ou no botão
document.querySelectorAll('.projeto-row').forEach(row => {
  row.addEventListener('click', () => {
    const id = row.getAttribute('data-project-id') || '1';
    openProjectDialog(id);
  });

  row.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const id = row.getAttribute('data-project-id') || '1';
      openProjectDialog(id);
    }
  });
});

// Fechar modal de projetos
document.querySelectorAll('[data-project-dialog-close]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    closeProjectDialog();
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && projectDialog && projectDialog.classList.contains('is-open')) {
    closeProjectDialog();
  }
});
