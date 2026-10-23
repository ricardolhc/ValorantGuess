interface ScoreboardProps { score: number; best: number }

export function Scoreboard({ score, best }: ScoreboardProps) {
  return (
    <section className="scores" aria-label="Pontuação">
      <div className="score" aria-label="Sua sequência">
        <svg className="score-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="m4 17 6-6 4 4 7-11M14 4h7v7" />
        </svg>
        <div><span className="label">Sua sequência</span><span className="score-value">{String(score).padStart(2, '0')}<small>acertos</small></span></div>
      </div>
      <div className="score" aria-label="Recorde pessoal">
        <svg className="score-icon trophy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M7 3h10v6a5 5 0 0 1-10 0V3ZM7 5H3v3a4 4 0 0 0 4 4M17 5h4v3a4 4 0 0 1-4 4M12 14v6M7 21h10" />
        </svg>
        <div><span className="label">Recorde pessoal</span><span className="score-value">{String(best).padStart(2, '0')}<small>acertos</small></span></div>
      </div>
    </section>
  )
}
