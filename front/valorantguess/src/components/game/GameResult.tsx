import { useEffect, useRef } from 'react'
import type { GameState } from '../../hooks/useGame'
import type { PlayableAbility } from '../../interface/ImageData'

interface GameResultProps { state: GameState; ability: PlayableAbility; onRestart: () => void }

export function GameResult({ state, ability, onRestart }: GameResultProps) {
  const title = useRef<HTMLHeadingElement>(null)
  useEffect(() => { title.current?.focus() }, [])
  return (
    <section className="arena result" role="region" aria-label="Resultado da partida">
      <div className="eyebrow">Fim da partida</div>
      <h2 ref={title} tabIndex={-1}>{state.defeatMessage?.title}</h2>
      <p className="result-description">{state.defeatMessage?.description}</p>
      <div className="result-score">{state.score}</div>
      <div className="result-score-label">{state.score === 1 ? 'ACERTO NA SEQUÊNCIA' : 'ACERTOS CONSECUTIVOS'}</div>
      <div className="answer-reveal">
        <img src={ability.displayIcon} alt={ability.displayName} />
        <div><span className="label">A resposta correta era</span><strong>{ability.displayName}</strong><span className="answer-agent">{ability.agentName}</span></div>
        <kbd>{ability.key}</kbd>
      </div>
      <p className="personal-best">
        {!state.recordSaved ? 'Recorde mantido nesta sessão. O navegador não permitiu salvá-lo.'
          : state.newRecord ? 'Novo recorde! Seu melhor resultado está salvo.' : 'Seu recorde está salvo neste navegador.'}
      </p>
      <button className="primary-action" type="button" onClick={onRestart}>TENTAR NOVAMENTE<span aria-hidden="true">↗</span></button>
    </section>
  )
}
