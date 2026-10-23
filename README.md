# ValorantGuess

Jogo React + TypeScript para identificar a tecla padrão de habilidades de Valorant.
O frontend consulta diretamente a [Valorant API](https://valorant-api.com/),
usando Axios e TanStack React Query para requisições, cache e tratamento de erros.
O sorteio acontece no navegador e considera habilidades de vários agentes jogáveis,
com ícone válido e tecla Q, E, C ou X. Passivas ficam de fora.
Não é necessário executar Java ou um servidor de API local.

## Executar

Com Node.js e npm instalados:

```sh
cd front/valorantguess
npm ci
npm run dev
```

Abra o endereço informado pelo Vite. É necessária conexão com a internet para
carregar o catálogo e as imagens da API. O catálogo fica no cache do React Query;
as próximas rodadas não repetem a consulta à API.

## Como jogar

- Clique em **Iniciar desafio**. A contagem **3 → 2 → 1** aparece antes da primeira habilidade.
- Responda com Q, E, C ou X no teclado, ou clique/toque no botão correspondente.
- Cada acerto soma um ponto e inicia outra rodada com **10 segundos** completos.
- Um erro ou tempo esgotado encerra a partida e revela habilidade, agente e tecla correta.
- **Tentar novamente** mostra uma contagem **3 → 2 → 1** antes da próxima partida.
- As habilidades são embaralhadas sem repetir até esgotar a lista.
- O recorde fica salvo neste navegador; se o armazenamento estiver bloqueado,
  o jogo mantém o recorde durante a sessão.

O cronômetro só começa após carregar a imagem. Uma falha de carregamento permite
carregar outra habilidade sem perder a sequência. Ao trocar de aba, o tempo da rodada
continua correndo. As respostas consideram as teclas padrão do jogo.

## Verificar

Na pasta `front/valorantguess`:

```sh
npm test
npm run lint
npm run build
```
