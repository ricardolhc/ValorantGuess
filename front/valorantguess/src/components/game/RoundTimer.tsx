interface RoundTimerProps { remainingMs: number; active: boolean }

export function RoundTimer({ remainingMs, active }: RoundTimerProps) {
  return (
    <div className={`round-timer${active && remainingMs <= 3000 ? ' urgent' : ''}`}>
      <span className="timer-caption">TEMPO<br />RESTANTE</span>
      <div className="clock">
        <svg viewBox="0 0 43 43" aria-hidden="true">
          <circle cx="21.5" cy="21.5" r="18" />
          <circle className="timer-ring" cx="21.5" cy="21.5" r="18" style={{ strokeDashoffset: 113 * (1 - remainingMs / 10000) }} />
        </svg>
        <span className="timer-number" role="timer" aria-label="Tempo restante" aria-live="off">
          {String(Math.ceil(remainingMs / 1000)).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
