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
  '.cf-feature-card',
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

/* --- Dynamic Tagline --- */
const taglinePhrases = [
  "Sites acessíveis para você!",
  "Design moderno que converte!",
  "Sua presença digital no próximo nível!",
  "Experiências únicas para seus clientes!"
];
const taglineEl = document.getElementById('dynamic-tagline');
if (taglineEl) {
  let phraseIndex = 0;
  setInterval(() => {
    taglineEl.style.opacity = '0';
    taglineEl.style.transform = 'translateY(-10px)';

    setTimeout(() => {
      phraseIndex = (phraseIndex + 1) % taglinePhrases.length;
      taglineEl.textContent = taglinePhrases[phraseIndex];

      // Position for coming from bottom
      taglineEl.style.transition = 'none';
      taglineEl.style.transform = 'translateY(10px)';

      // Trigger reflow to apply 'none' transition
      taglineEl.offsetHeight;

      // Restore transition and fade in
      taglineEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      taglineEl.style.opacity = '1';
      taglineEl.style.transform = 'translateY(0)';
    }, 500); // Wait for fade out to complete
  }, 5000);
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
    // 1. Fixa "Sobre nós" no topo até que "Projetos" suba e o cubra por completo
    ScrollTrigger.create({
      trigger: sobre,
      start: 'top top',
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
    // seguido do retorno ao preto também da esquerda para a direita (unidirecional)
    const liquidOverlay = document.querySelector('.liquid-title-overlay');
    if (liquidOverlay) {
      const titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#projetos',
          start: 'top 75%',
          toggleActions: 'restart none none none'
        }
      });

      titleTl
        .set(liquidOverlay, { clipPath: 'inset(0 100% 0 0)' })
        // Fase 1: Avança laranja da esquerda para a direita
        .to(liquidOverlay, {
          clipPath: 'inset(0 0% 0 0%)',
          duration: 1.15,
          ease: 'power2.inOut'
        })
        // Fase 2: Pausa destacando o título 100% laranja
        .to({}, { duration: 0.3 })
        // Fase 3: A cor preta avança também da esquerda para a direita (unidirecional)
        .to(liquidOverlay, {
          clipPath: 'inset(0 0% 0 100%)',
          duration: 1.15,
          ease: 'power2.inOut'
        })
        // Reset silencioso para permitir replay perfeito ao rolar novamente
        .set(liquidOverlay, { clipPath: 'inset(0 100% 0 0)' });
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

  // Mobile (<= 768px)
  mm.add("(max-width: 768px)", () => {
    ScrollTrigger.create({
      trigger: sobre,
      start: 'bottom bottom',
      endTrigger: projetos,
      end: 'top top',
      pin: true,
      pinSpacing: false
    });

    gsap.to('#sobre .container', {
      scale: 0.97,
      opacity: 0.6,
      ease: 'none',
      scrollTrigger: {
        trigger: projetos,
        start: 'top bottom',
        end: 'top top',
        scrub: 1
      }
    });

    // Título líquido no mobile (unidirecional da esquerda para a direita)
    const liquidOverlayMob = document.querySelector('.liquid-title-overlay');
    if (liquidOverlayMob) {
      const titleTlMob = gsap.timeline({
        scrollTrigger: {
          trigger: '#projetos',
          start: 'top 78%',
          toggleActions: 'restart none none none'
        }
      });

      titleTlMob
        .set(liquidOverlayMob, { clipPath: 'inset(0 100% 0 0)' })
        .to(liquidOverlayMob, {
          clipPath: 'inset(0 0% 0 0%)',
          duration: 1.1,
          ease: 'power2.inOut'
        })
        .to({}, { duration: 0.25 })
        .to(liquidOverlayMob, {
          clipPath: 'inset(0 0% 0 100%)',
          duration: 1.1,
          ease: 'power2.inOut'
        })
        .set(liquidOverlayMob, { clipPath: 'inset(0 100% 0 0)' });
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

    // 6. Manchas e Pingos de Tinta Real — Animação Orgânica de Impacto e Escorrimento
    const paintSplashes = gsap.utils.toArray('.paint-splash');
    const paintDrips = gsap.utils.toArray('.paint-drip');
    const satelliteDrops = gsap.utils.toArray('.satellite-drop');

    // Splashes: impacto orgânico como tinta fresca batendo na folha e abrindo tentáculos
    paintSplashes.forEach((splash, i) => {
      gsap.fromTo(splash,
        { scale: 0.15, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.15,
          delay: 0.1 + i * 0.18,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#projetos',
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Drips: escorrimento natural via CSS puro (classe .drip-reveal) ativado pelo ScrollTrigger
    paintDrips.forEach((drip, i) => {
      // Define o delay dinâmico diretamente no CSS inline do elemento
      drip.style.transitionDelay = `${0.4 + i * 0.25}s`;

      ScrollTrigger.create({
        trigger: '#projetos',
        start: 'top 70%',
        onEnter: () => drip.classList.add('drip-reveal')
      });
    });

    // Gotas satélites: respingos que se soltaram e caíram independentes
    if (satelliteDrops.length > 0) {
      gsap.fromTo(satelliteDrops,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 0.75,
          duration: 0.7,
          stagger: 0.06,
          delay: 0.25,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: '#projetos',
            start: 'top 70%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

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

/* ============================
   COMO FUNCIONA - FEATURE CARDS
   ============================ */
const cfNavNums = document.querySelectorAll('.cf-nav-num');
const cfFeatureCards = document.querySelectorAll('.cf-feature-card');
const cfOverlay = document.querySelector('.cf-transition-overlay');

// Seta o estado inicial do overlay no GSAP: inclinado e escondido à direita
gsap.set(cfOverlay, { skewX: -15, xPercent: 120 });

let isCfAnimating = false;

cfNavNums.forEach(navNum => {
  navNum.addEventListener('click', () => {
    if (navNum.classList.contains('active') || isCfAnimating) return;
    isCfAnimating = true;

    const targetId = navNum.getAttribute('data-target');
    const oldCard = document.querySelector('.cf-feature-card.active');
    const newCard = document.getElementById(`card-${targetId}`);

    // Atualiza classes da navegação lateral
    cfNavNums.forEach(num => num.classList.remove('active'));
    navNum.classList.add('active');
    
    const tl = gsap.timeline({
      onComplete: () => { 
        isCfAnimating = false; 
        gsap.set(cfOverlay, { autoAlpha: 0 }); // Esconde totalmente no fim
      }
    });
    
    // Varredura contínua da DIREITA para a ESQUERDA
    tl.fromTo(cfOverlay, 
      { xPercent: 120, autoAlpha: 1, skewX: -15 },
      { 
        xPercent: -120, 
        duration: 1.5, 
        ease: 'power2.inOut',
        onUpdate: function() {
          // Troca o card exatamente na metade do movimento (quando a tela ta coberta)
          if (this.progress() >= 0.5 && oldCard.classList.contains('active')) {
            oldCard.classList.remove('active');
            newCard.classList.add('active');
          }
        }
      }
    );
  });
});
