
import './App.css'
import { Scoreboard } from './components/game/Scoreboard'
import { GameArena } from './components/game/GameArena'
import { GameResult } from './components/game/GameResult'
import { useAbilities } from './hooks/useAbilities'
import { useGame } from './hooks/useGame'
import type { PlayableAbility } from './interface/ImageData'

const emptyAbilities: PlayableAbility[] = []

function App() {
  const catalogue = useAbilities()
  const game = useGame(catalogue.data ?? emptyAbilities)
  const { state } = game

  return (
    <>
      <header className="site-header">
        <a className="brand" href="./" aria-label="Valorant Guess, início">
          <svg viewBox="0 0 40 36" aria-hidden="true"><path d="M2 3 19 25H8L2 17ZM38 3 21 25h11l6-8Z" /></svg>
          <span>VALORANT<span className="brand-accent">GUESS</span></span>
        </a>
        <div className="header-info">
          <span className="header-status">UMA HABILIDADE. UMA ESCOLHA.</span>
          <span className="mode-tag">Modo sequência</span>
        </div>
      </header>
      <main className="game-layout">
        <section className="intro" aria-labelledby="game-title">
          <div>
            <div className="eyebrow">Teste seu instinto</div>
            <h1 id="game-title">Qual é a tecla?</h1>
            <p>Reconheça a habilidade. Acerte a tecla. Continue no jogo.</p>
          </div>
          <div className="rules-summary">AS REGRAS SÃO SIMPLES<strong>10 SEGUNDOS · 1 CHANCE</strong></div>
        </section>
        <Scoreboard score={state.score} best={state.best} />
        {state.phase === 'ended' && state.ability ? (
          <GameResult state={state} ability={state.ability} onRestart={game.restart} />
        ) : (
          <GameArena state={state} catalogueLoading={catalogue.isLoading || catalogue.isFetching}
            catalogueError={catalogue.isError} onStart={() => void game.start()}
            onAnswer={key => void game.answer(key)} onRetryImage={() => void game.retryImage()}
            onRetryCatalogue={() => void catalogue.refetch()} />
        )}
        {state.phase !== 'ended' && (
          <div className="play-helper">
            <span>Use <kbd>Q</kbd> <kbd>E</kbd> <kbd>C</kbd> <kbd>X</kbd> ou toque nos botões.</span>
            <span><span className="helper-dot" aria-hidden="true">●</span> Um erro ou tempo esgotado encerra a partida.</span>
          </div>
        )}
        <p className="feedback" role="status" aria-live="polite">
          {state.phase === 'countdown' ? `Começando em ${state.countdown}…` : state.feedback}
        </p>
        <footer className="site-footer">
          <span>FEITO PARA QUEM CONHECE CADA DETALHE.</span>
          <span>Projeto de fã · Sem vínculo com a Riot Games.</span>
        </footer>
      </main>
    </>
  )
}

export default App
