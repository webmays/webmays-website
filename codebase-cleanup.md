# Plano de Limpeza e Refatoração de Código (Clean Code)

## Objetivo
Remover todo o código morto, resíduos de templates anteriores e classes CSS/JS órfãs, eliminando "gambiarras" (como manipulação de estilos inline e !important desnecessários) mantendo 100% da identidade visual, estrutura e lógica funcionais intactas.

## Tarefas

- [x] **Tarefa 1: Limpeza e Modernização do JavaScript (`script.js`)**
  - Remover `timelineObserver` órfão (observava elemento `.timeline-fill` inexistente)
  - Refatorar controle do hamburger: transferir manipulação inline de `spans` para classe CSS declarativa (`.hamburger.open span`)
  - Verificar integridade de sintaxe (`node -c script.js`)

- [x] **Tarefa 2: Limpeza do HTML (`index.html`)**
  - Remover `.cf-drip-accent` (bloco inativo `display: none !important` que carregava imagem sem uso)
  - Remover classe conflitante `btn-primary` do link `#faq-cta` (elimina a causa-raiz de 5 `!important` no CSS)
  - Garantir integridade de todos os IDs e estruturas

- [x] **Tarefa 3: Limpeza e Eliminação de Gambiarras no CSS (`style.css`)**
  - Remover classes mortas do template antigo (~570 linhas removidas):
    - Hero antigo: `.hero-logo-wrap`, `.browser-mock`, `.mock-card`, `.hero-stats`, `.btn-ghost`, etc.
    - Sobre Nós antigo: `.sobre-grid`, `.sobre-card`, `.sc-header`, `.sc-avatar`, `.sc-quote`, etc.
    - Serviços antigo: `.servico-adendo-wrap`, `.servico-badge--obs`, `.paint-satellites`, etc.
    - Media queries responsivas mortas: `.steps-grid`, `.projetos-grid`, etc.
  - Adicionar suporte nativo no CSS para `.hamburger.open span`
  - Remover `!important` desnecessários de `#faq-cta` e `.servicos-container`
  - Incrementar versão de cache do CSS/JS no `index.html`

- [x] **Tarefa 4: Verificação de Integridade e Validação**
  - Checagem de syntax (JS e CSS válidos e balanceados)
  - Garantir ausência de quebras no layout desktop e mobile

## Critérios de Conclusão
- [x] Redução de ~592 linhas de código lixo/morto (saldo líquido: -554 linhas)
- [x] Zero erros de console ou de sintaxe
- [x] Visual e animações 100% preservados
