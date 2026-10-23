import type { GameState } from '../../hooks/useGame'
import type { AbilityKey } from '../../interface/ImageData'
import { RoundTimer } from './RoundTimer'

interface GameArenaProps {
  state: GameState
  catalogueLoading: boolean
  catalogueError: boolean
  onStart: () => void
  onAnswer: (key: AbilityKey) => void
  onRetryImage: () => void
  onRetryCatalogue: () => void
}

const keys: AbilityKey[] = ['Q', 'E', 'C', 'X']

export function GameArena({ state, catalogueLoading, catalogueError, onStart, onAnswer, onRetryImage, onRetryCatalogue }: GameArenaProps) {
  const { phase } = state
  const failed = catalogueError || phase === 'error'
  const instructions = catalogueLoading ? 'Carregando habilidades…'
    : failed ? 'Não foi possível carregar. Sua sequência está preservada.'
    : phase === 'ready' ? 'A habilidade só aparece quando você começar.'
    : phase === 'countdown' ? 'Prepare-se. Confie no seu instinto.'
    : phase === 'loading' ? 'Preparando a próxima habilidade…'
    : 'Qual tecla ativa esta habilidade?'

  return (
    <section className="arena" aria-label="Desafio da habilidade">
      <div className="arena-top">
        <div className="round-label">HABILIDADE <span>{String(state.score + 1).padStart(2, '0')}</span></div>
        <RoundTimer remainingMs={state.remainingMs} active={phase === 'playing'} />
      </div>
      <div className="ability-art">
        <span className="art-decoration" aria-hidden="true">// IDENTIFIQUE O ÍCONE</span>
        <div className="icon-frame">
          {phase === 'playing' && state.ability ? (
            <img key={state.ability.id} className="ability-icon" src={state.ability.displayIcon} alt="Ícone da habilidade a identificar" draggable={false} />
          ) : phase === 'countdown' ? (
            <span key={state.countdown} className="mystery counting" aria-label="Contagem para começar">{state.countdown}</span>
          ) : <span className="mystery" aria-hidden="true">{failed ? '!' : phase === 'loading' ? '…' : '?'}</span>}
        </div>
        <span className="art-decoration right" aria-hidden="true">VALORANT GUESS // {String(state.score + 1).padStart(3, '0')}</span>
      </div>
      <p className="instruction" role={failed ? 'alert' : catalogueLoading || phase === 'loading' ? 'status' : undefined}>{instructions}</p>
      <div className="keys" role="group" aria-label="Escolha a tecla da habilidade">
        {keys.map((key, index) => (
          <button key={key} className="key" type="button" aria-label={`Responder ${key}`} disabled={phase !== 'playing'} onClick={() => onAnswer(key)}>
            <span className="key-number" aria-hidden="true">0{index + 1}</span>
            <span className="key-letter" aria-hidden="true">{key}</span>
            <span className="key-hint" aria-hidden="true">{key === 'X' ? 'ULTIMATE' : 'HABILIDADE'}</span>
          </button>
        ))}
      </div>
      <div className={`progress-track${phase === 'playing' && state.remainingMs <= 3000 ? ' urgent' : ''}`} aria-hidden="true">
        <div className="progress-fill" style={{ width: `${state.remainingMs / 100}%` }} />
      </div>
      {(phase === 'ready' || failed) && (
        <button className="primary-action" type="button" disabled={catalogueLoading} onClick={catalogueError ? onRetryCatalogue : phase === 'error' ? onRetryImage : onStart}>
          {catalogueLoading ? 'CARREGANDO HABILIDADES…' : failed ? 'TENTAR CARREGAR NOVAMENTE' : 'INICIAR DESAFIO'}<span aria-hidden="true">↗</span>
        </button>
      )}
    </section>
  )
}
