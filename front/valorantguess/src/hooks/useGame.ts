import { useCallback, useEffect, useRef, useState } from 'react'
import type { AbilityKey, PlayableAbility } from '../interface/ImageData'
import { shuffledAbilities } from '../game/abilities'
import { loadAbilityImage } from '../game/images'
import { readRecord, saveRecord } from '../game/records'
import { pickDefeatMessage, type DefeatMessage } from '../game/defeatMessages'

export interface GameState {
  phase: 'ready' | 'countdown' | 'loading' | 'playing' | 'ended' | 'error'
  ability: PlayableAbility | null
  score: number
  best: number
  recordSaved: boolean
  newRecord: boolean
  remainingMs: number
  countdown: number
  outcome: 'wrong' | 'timeout' | null
  defeatMessage: DefeatMessage | null
  feedback: string
}

export function useGame(abilities: PlayableAbility[]) {
  const [state, setState] = useState<GameState>(() => ({
    phase: 'ready', ability: null, score: 0, ...readRecord(), newRecord: false,
    remainingMs: 10000, countdown: 3, outcome: null, defeatMessage: null, feedback: '',
  }))
  const current = useRef(state)
  const deck = useRef<PlayableAbility[]>([])
  const previousId = useRef<string>()
  const version = useRef(0)
  const imageRequest = useRef<AbortController>()
  const deadline = useRef(0)
  const countdownDeadline = useRef(0)
  const startingBest = useRef(state.best)
  const previousDefeatTitle = useRef<string>()

  // Update the ref synchronously so a second click cannot submit the old round.
  const update = useCallback((next: GameState) => {
    current.current = next
    setState(next)
  }, [])

  const finish = useCallback((outcome: 'wrong' | 'timeout') => {
    const latest = current.current
    if (latest.phase !== 'playing') return
    const defeatMessage = pickDefeatMessage(outcome, previousDefeatTitle.current)
    previousDefeatTitle.current = defeatMessage.title
    update({ ...latest, phase: 'ended', outcome, defeatMessage, feedback: '',
      remainingMs: outcome === 'timeout' ? 0 : latest.remainingMs,
      newRecord: latest.score > startingBest.current,
    })
  }, [update])

  const loadRound = useCallback(async (score: number) => {
    const requestVersion = ++version.current
    imageRequest.current?.abort()
    const controller = new AbortController()
    imageRequest.current = controller
    update({ ...current.current, phase: 'loading', ability: null, score, remainingMs: 10000 })
    if (!deck.current.length) deck.current = shuffledAbilities(abilities, previousId.current)
    const ability = deck.current.shift()
    try {
      if (!ability) throw new Error('No abilities available')
      await loadAbilityImage(ability.displayIcon, controller.signal)
      if (version.current !== requestVersion) return
      previousId.current = ability.id
      deadline.current = performance.now() + 10000
      update({ ...current.current, phase: 'playing', ability, remainingMs: 10000 })
    } catch {
      if (version.current !== requestVersion || controller.signal.aborted) return
      update({ ...current.current, phase: 'error', ability: null })
    }
  }, [abilities, update])

  const reset = useCallback(() => {
    ++version.current
    imageRequest.current?.abort()
    deck.current = []
    startingBest.current = current.current.best
    update({ ...current.current, phase: 'ready', ability: null, score: 0,
      countdown: 3, remainingMs: 10000, outcome: null, defeatMessage: null, newRecord: false, feedback: '',
    })
  }, [update])

  const beginCountdown = useCallback(() => {
    reset()
    countdownDeadline.current = performance.now() + 3000
    update({ ...current.current, phase: 'countdown', countdown: 3 })
  }, [reset, update])

  const start = useCallback(() => {
    if (current.current.phase === 'ready' && abilities.length) beginCountdown()
  }, [abilities.length, beginCountdown])

  const restart = useCallback(() => {
    if (current.current.phase === 'ended') beginCountdown()
  }, [beginCountdown])

  const answer = useCallback((key: AbilityKey) => {
    const latest = current.current
    if (latest.phase !== 'playing' || !latest.ability) return
    if (performance.now() >= deadline.current) { finish('timeout'); return }
    if (key !== latest.ability.key) { finish('wrong'); return }
    const score = latest.score + 1
    const best = Math.max(score, latest.best)
    const recordSaved = best > latest.best ? saveRecord(best) : latest.recordSaved
    update({ ...latest, score, best, recordSaved,
      feedback: `Boa! ${score} ${score === 1 ? 'acerto' : 'acertos'} na sequência.`,
    })
    return loadRound(score)
  }, [finish, loadRound, update])

  const retryImage = useCallback(() => {
    if (current.current.phase === 'error') return loadRound(current.current.score)
  }, [loadRound])

  useEffect(() => {
    if (state.phase !== 'playing' && state.phase !== 'countdown') return
    const tick = () => {
      const latest = current.current
      if (latest.phase === 'countdown') {
        const count = Math.max(0, Math.ceil((countdownDeadline.current - performance.now()) / 1000))
        if (!count) { void loadRound(0); return }
        if (count !== latest.countdown) update({ ...latest, countdown: count })
      } else if (latest.phase === 'playing') {
        const remainingMs = Math.max(0, deadline.current - performance.now())
        if (!remainingMs) { finish('timeout'); return }
        update({ ...latest, remainingMs })
      }
    }
    const interval = setInterval(tick, 50)
    document.addEventListener('visibilitychange', tick)
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', tick) }
  }, [state.phase, finish, loadRound, update])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (current.current.phase !== 'playing' || event.repeat || event.ctrlKey || event.altKey || event.metaKey) return
      const target = event.target
      if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return
      const key = event.key.toUpperCase()
      if (key === 'Q' || key === 'E' || key === 'C' || key === 'X') {
        event.preventDefault()
        void answer(key)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [answer])

  useEffect(() => () => { ++version.current; imageRequest.current?.abort() }, [])

  return { state, start, restart, answer, retryImage }
}
