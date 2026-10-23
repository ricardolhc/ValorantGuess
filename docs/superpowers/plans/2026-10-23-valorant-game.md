# Valorant Guess Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Integrar a prévia aprovada em um jogo React completo.

**Architecture:** React Query busca e guarda o catálogo. Serviço normaliza os dados;
hook controla sorteio, imagem, contagem, prazo e recorde. Componentes apresentam
as telas e CSS reproduz a prévia.

**Tech Stack:** React 18, TypeScript, Vite 4, React Query 4, Axios, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-23-valorant-game-design.md`

## Global Constraints

- 10 segundos por habilidade; erro ou prazo esgotado encerra a partida.
- Reinício com 3 → 2 → 1; nunca revelar a habilidade antes do início.
- Chamadas diretas da aplicação à Valorant API; nenhum Java ou backend.
- Preservar alterações anteriores. Commits locais autorizados posteriormente; não publicar.

## Review Focus

- API contém agentes sem habilidades e habilidades passivas ou nulas.
- Cliques repetidos e teclas mantidas não podem somar pontos em duplicidade.
- Imagens lentas ou quebradas não podem consumir o tempo de resposta.
- Abas ocultas não podem prolongar os 10 segundos por atrasar callbacks.
- Falha de localStorage e desmontagem não podem quebrar ou ressuscitar partidas.

### Task 1: Catálogo jogável

**Files:** `src/services/abilities.ts`, `src/services/abilities.test.ts`,
`src/interface/AgentData.ts`, `src/interface/ImageData.ts`, `src/hooks/useAbilities.ts`.

**Interfaces:** `fetchAbilities(signal?: AbortSignal): Promise<PlayableAbility[]>`;
`PlayableAbility` contém id, key, slot, displayIcon, displayName, agentName.

- [x] Testar catálogo de vários agentes, mapeamento Q/E/C/X, exclusão de passivas,
  entradas nulas, catálogo vazio, resposta inválida e falha de rede.
- [x] Rodar `npm test` e observar falhas antes de implementar.
- [x] Normalizar o catálogo e configurar cache React Query sem refetch ao focar.
- [x] Rodar `npm test` e confirmar os testes verdes.

### Task 2: Motor da partida

**Files:** `src/game/abilities.ts`, `src/game/images.ts`, `src/hooks/useGame.ts`,
`src/hooks/useGame.test.tsx`; configuração de testes DOM e dependências de teste.

**Interfaces:** `useGame(abilities)` retorna estado e ações start, restart, answer, retryImage.
Estados: ready, countdown, loading, playing, ended, error.

- [x] Testar ícone oculto inicialmente, cronômetro após imagem, acerto, derrota,
  timeout, 3/2/1 no reinício, bloqueio durante carregamento/contagem,
  catálogo sem reposição, persistência e storage bloqueado, cancelamento no unmount.
- [x] Rodar os testes e observar falhas antes de implementar.
- [x] Implementar hook com prazos absolutos, cancelamento e baralho embaralhado.
- [x] Rodar `npm test` e confirmar a suíte verde.

### Task 3: Interface aprovada e integração

**Files:** `src/App.tsx`, `src/App.css`, `src/index.css`, `src/main.tsx`,
`src/components/game/*`, `src/App.test.tsx`, `index.html`, `README.md`.

**Interfaces:** App consome `useAbilities` e `useGame`; componentes recebem estado e callbacks.

- [x] Testar fluxo com API simulada, tecla correta, erro e resultado, respostas
  por teclado e repetição ignorada, carregamento/erro de API, reinício com contagem.
- [x] Rodar os testes e observar falhas antes de implementar.
- [x] Portar o visual da prévia, remover componentes substituídos e Bootstrap não utilizado,
  adaptar ao mobile e documentar o jogo.
- [x] Rodar `npm test`, `npm run lint`, `npm run build`, `git diff --check`.
- [x] Revisar a implementação e executar verificação real do catálogo/imagens e HTTP local.
