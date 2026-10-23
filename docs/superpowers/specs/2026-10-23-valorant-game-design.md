# Valorant Guess — versão aprovada

## Intenção e regras

Integrar ao React o visual e a jogabilidade aprovados na prévia `valorant-direction-v3.html`.
Identificar, pelo ícone, a tecla padrão Q, E, C ou X. Cada acerto soma um ponto e
leva à próxima habilidade. Um erro ou 10 segundos esgotados encerra a partida.
Salvar o recorde no navegador. Mostrar a habilidade, agente e resposta correta
no resultado. Tanto Iniciar desafio quanto Tentar novamente exibem 3 → 2 → 1
antes de revelar a primeira habilidade.

## Apresentação

Fundo azul-escuro, detalhes em vermelho, ícone central, quatro teclas grandes,
cronômetro circular e barra de tempo, sequência e recorde. Layout responsivo,
respostas por clique, toque e teclado, foco visível e respeito à redução de movimento.
Antes de começar e durante a contagem, nenhuma habilidade fica visível.

## Abordagem

Manter React 18, TypeScript, Vite 4 e TanStack React Query 4 existentes.
React Query guarda o catálogo; um hook controla a partida e os prazos locais.
Buscar outro agente na API a cada resposta criaria atrasos desnecessários;
guardar estado de partida no cache misturaria regras locais com dados remotos.
Não usar Java, proxy ou backend. Não adicionar ranking, contas ou dificuldade variável.

## Dados e limites

Usar agentes jogáveis, com habilidades de slots conhecidos e ícones válidos;
excluir passivas, listas nulas e entradas nulas. Embaralhar sem reposição até
esgotar o catálogo e evitar repetição imediata entre ciclos. Revelar a imagem
somente após carregar; iniciar o prazo de 10 segundos nesse momento.
Falha de rede ou imagem permite tentar carregar novamente sem contar como derrota.
Armazenamento indisponível não impede jogar. Expiração é por prazo absoluto,
inclusive ao retornar à aba. Contagem e carregamento bloqueiam respostas.

## Escopo autorizado

O usuário aprovou a prévia e solicitou explicitamente aplicar a versão ao React.
Manter as alterações anteriores do workspace. O usuário autorizou posteriormente
criar commits locais. Não publicar.
