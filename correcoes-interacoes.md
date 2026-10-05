# Plano de Implementação — Correções de Interações, GSAP & UI/UX

## 🎯 Objetivo
Resolver o bug de navegação GSAP/ScrollTrigger no link "Sobre nós", suavizar a repulsão magnética do Hero, modernizar a seção e modal de Projetos (Morphing Dialog com scroll interno, contadores numéricos dinâmicos, preenchimento líquido azul e novos botões com hierarquia primária/secundária), aprimorar as bordas de Serviços e reconstruir a animação do FAQ sem saltos de layout. Realizar também a varredura e limpeza de código morto (/clean-code).

---

## 🔍 Diagnóstico e Investigação (/debug)

### 1. Bug Navbar "Sobre nós" → "Projetos"
- **Causa Raiz**: O elemento `#sobre` possui `pin: true, pinSpacing: false` configurado via ScrollTrigger. Quando o usuário está em seções inferiores e clica em "Sobre nós", a medição de posição feita pelo Lenis lê a coordenada fixada/deslocada de `#sobre` (que coincide com o topo de `#projetos`). Além disso, não há compensação da altura fixa da barra de navegação (`navHeight`).
- **Solução**:
  1. No manipulador de rolagem suave dos links da navbar (`script.js`), identificar se o alvo possui `.pin-spacer` associado ou utilizar a coordenada estática real em relação ao topo do documento (`pinSpacer.getBoundingClientRect().top + window.pageYOffset - navHeight`).
  2. Ajustar os marcadores de rolagem para que `#sobre` seja ancorado de forma estável, sem conflito de posição com `#projetos`.

### 2. Repulsão Magnética Excessiva no Hero
- **Causa Raiz**: Fatores de translação elevados (`moveX: 28px`, `moveY: 22px`, `rotate: 12deg`, raio `1.5x`).
- **Solução**: Reduzir em ~60% a intensidade (`moveX: 12px`, `moveY: 10px`, `rotate: 5deg`), estreitar o raio de sensibilidade para `1.1x` e aplicar decaimento cúbico suave (`factor = (1 - dist/maxRadius)^1.8`), tornando a resposta magnética delicada e elegante.

### 3. FAQ — Seção Pulando e Animação Rígida
- **Causa Raiz**:
  1. `.faq-container` está com `align-items: center;`. Ao expandir um item do FAQ, a altura da coluna direita aumenta e o centro vertical da coluna esquerda é recalculado, fazendo toda a seção e o bloco esquerdo descerem abruptamente.
  2. A transição de `max-height: 0` para `300px` cria um atraso perceptível de aceleração/desaceleração.
- **Solução**:
  1. Alterar `.faq-container` para `align-items: flex-start;` e fixar `.faq-left` como `position: sticky; top: 120px;` (sem qualquer movimento vertical indesejado ao abrir perguntas).
  2. Migrar o acordeão para a técnica moderna de **CSS Grid** (`grid-template-rows: 0fr` ➔ `1fr`) com revelação suave de opacidade e translação interna, eliminando engasgos.

---

## 🛠️ Detalhamento das Alterações

### Fase 1: Varredura e Limpeza de Código Morto (/clean-code & /simplify-code)
- **Remover em `script.js`**:
  - `const numberEls = gsap.utils.toArray('.projeto-index');` e a respectiva timeline (os números `01`-`04` já foram removidos).
  - Variáveis não utilizadas e referências obsoletas de CSS.
- **Remover em `style.css`**:
  - Regras antigas de `.projeto-index`.
  - Regras não mais aplicadas de `.dialog-tech-tags` e `.dialog-tech-tag`.
  - Resíduos de seletores de doodles desativados.

### Fase 2: Hero & Navegação (Navbar)
- **`script.js`**:
  - Refinar o cálculo de scroll suave no Lenis para considerar a altura da navbar (`~75px`) e o contêiner estático de `#sobre`.
  - Calibrar o repel magnético das letras para toque suave.

### Fase 3: Cards da Seção "Projetos"
- **`index.html`**:
  - Título principal (`.projeto-name`): Grande, centralizado e laranja.
  - Subtítulo (`.projeto-subtype`): Abaixo do título, centralizado, indicando "o que ele é" (ex: Loja Virtual Completa, Landing Page de Conversão, etc.).
  - Descrição (`.projeto-desc`): Alinhada à esquerda com espaçamento fluido e poucas quebras de linha.
  - Botão "Ver detalhes" (`.projeto-row-link`): Contorno preto (`border: 1.5px solid #0F172A`), fundo branco e texto azul. Ao passar o mouse, onda líquida orgânica azul (`#0057FF`) preenche o botão e o texto fica branco.
- **`style.css`**:
  - Adicionar o mesmo **Spotlight Border** interativo da seção "Serviços" em `.projeto-row` (`radial-gradient` laranja `#FF5A00` rastreando `--spot-x` e `--spot-y`).
- **`script.js`**:
  - Adicionar listeners de `pointermove` e `pointerleave` nos cards de projetos para atualizar `--spot-x`, `--spot-y` e `--spot-opacity`.

### Fase 4: Morphing Dialog de Projetos (Modal)
- **Permitir Scroll Interno**:
  - Adicionar `data-lenis-prevent` no `.morphing-dialog-container` para impedir que o Lenis bloqueie a rolagem nativa interna.
  - Configurar `overscroll-behavior: contain;` e `touch-action: pan-y;`.
- **Ajustar Blur & Backdrop**:
  - Reduzir o desfoque de `14px` para `6px` com fundo mais leve (`rgba(15, 23, 42, 0.45)`) e transição imediata de `0.2s ease` (eliminando peso no processamento e atraso visual).
- **Conteúdo Reestruturado**:
  - Cabeçalho: Título grande laranja centralizado, subtítulo "o que ele é", descrição alinhada à esquerda.
  - "Objetivo" (antigo "Sobre a Solução").
  - "Recursos chave" (antigo "Entregas & Recursos chave").
  - Remover seção de tecnologias utilizadas.
  - **Efeito Dinâmico de Números**: Números dinâmicos sem card (tipografia grande e pura), com contador progressivo rápido via JavaScript (`requestAnimationFrame`) e legendas discretas/profissionais posicionados logo acima dos botões.
  - **Barra de Ação (Footer do Modal - Nova Hierarquia)**:
    - **Botão Principal (Destaque)**: "Entre em contato" (modelo do card com preenchimento líquido e link direto WhatsApp para o projeto).
    - **Botão Secundário (Cinza apagado)**: "Montar minha ideia" (abre o formulário interno de orçamento com o projeto em mente).
    - **Ícone WhatsApp**: Botão lateral em preto apagado (`#0F172A`), minimalista e elegante.

### Fase 5: Seção Serviços — Borda Expandida no Hover
- **`style.css`**:
  - Aumentar a espessura da borda e do feixe de luz ao passar o mouse em `.servico-card:hover` (expansão nítida para `2.5px`/`3px` com glow laranja destacado).

### Fase 6: FAQ — Animação Fluida & Seção Estável
- **`style.css` & `index.html`**:
  - Ajustar `.faq-container` para `align-items: flex-start;` e `.faq-left` como `position: sticky; top: 120px;`.
  - Atualizar o acordeão para transição em CSS Grid (`grid-template-rows: 0fr` ➔ `1fr`) com fade e slide sutil no texto.

---

## 🧪 Plano de Verificação

1. **Teste de Navegação**:
   - Rolar até o rodapé ou FAQ.
   - Clicar em "Sobre nós" na navbar e confirmar que a página ancora com precisão no topo de `#sobre`, sem descer para `#projetos`.
2. **Teste Magnético Hero**:
   - Mover o mouse velozmente pelas letras do título e constatar toque suave e sutil, sem saltos.
3. **Teste da Seção Projetos**:
   - Verificar títulos laranja centralizados, subtítulos, descrições alinhadas à esquerda e botões com preenchimento líquido azul.
   - Constatar spotlight border laranja acompanhando o ponteiro nos cards.
4. **Teste do Modal de Projetos**:
   - Abrir o modal: verificar blur instantâneo e suave, rolagem fluida do conteúdo longo, contadores numéricos animados e layout sem tecnologias.
   - Testar hierarquia: "Entre em contato" (principal), "Montar minha ideia" (secundário cinza) e ícone WhatsApp.
5. **Teste de Serviços**:
   - Passar o mouse pelos cards e confirmar ampliação da borda.
6. **Teste de FAQ**:
   - Clicar em várias perguntas alternadamente: verificar transição fluida sem nenhum pulo vertical na coluna esquerda ou no restante da página.
