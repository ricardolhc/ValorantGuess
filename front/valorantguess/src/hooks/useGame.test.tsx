// @vitest-environment jsdom
import { act, cleanup, fireEvent, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGame } from './useGame'
import { abilities } from '../test/fixtures'
import { mockImages } from '../test/images'

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'performance'] })
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

async function beginGame(result: { current: ReturnType<typeof useGame> }) {
  act(() => result.current.start())
  await act(async () => { await vi.advanceTimersByTimeAsync(3000) })
}

describe('useGame', () => {
  it.each(['wrong', 'timeout'] as const)('varies %s defeat messages between games and keeps each result stable', async outcome => {
    mockImages()
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const { result } = renderHook(() => useGame(abilities))
    const lose = async () => {
      if (outcome === 'timeout') {
        await act(async () => { await vi.advanceTimersByTimeAsync(10000) })
      } else {
        act(() => { void result.current.answer(result.current.state.ability!.key === 'Q' ? 'E' : 'Q') })
      }
    }
    await beginGame(result)
    await lose()
    const first = result.current.state.defeatMessage
    expect(first?.title).toBeTruthy()
    expect(first?.description).toBeTruthy()
    act(() => { void result.current.answer('Q') })
    expect(result.current.state.defeatMessage).toEqual(first)
    act(() => result.current.restart())
    await act(async () => { await vi.advanceTimersByTimeAsync(3000) })
    await lose()
    expect(result.current.state.defeatMessage?.title).not.toBe(first?.title)
  })

  it('shows 3, 2, 1 before the very first ability, then grants the full ten seconds', async () => {
    mockImages()
    const { result } = renderHook(() => useGame(abilities))
    act(() => { void result.current.start() })
    for (const value of [3, 2, 1]) {
      expect(result.current.state.phase).toBe('countdown')
      expect(result.current.state.countdown).toBe(value)
      expect(result.current.state.ability).toBeNull()
      expect(result.current.state.remainingMs).toBe(10000)
      act(() => { void result.current.start(); void result.current.answer('Q') })
      expect(result.current.state.score).toBe(0)
      await act(async () => { await vi.advanceTimersByTimeAsync(1000) })
    }
    expect(result.current.state.phase).toBe('playing')
    expect(result.current.state.remainingMs).toBe(10000)
  })

  it('keeps the ability hidden until the player starts and the image loads', async () => {
    const images = mockImages()
    images.pause()
    const { result } = renderHook(() => useGame(abilities))
    expect(result.current.state.phase).toBe('ready')
    expect(result.current.state.ability).toBeNull()
    act(() => { void result.current.start() })
    await act(async () => { await vi.advanceTimersByTimeAsync(3000) })
    expect(result.current.state.phase).toBe('loading')
    await act(async () => { await vi.advanceTimersByTimeAsync(10000) })
    expect(result.current.state.remainingMs).toBe(10000)
    expect(result.current.state.phase).toBe('loading')
    await act(async () => { images.resolve() })
    expect(result.current.state.phase).toBe('playing')
    expect(result.current.state.ability).not.toBeNull()
    expect(result.current.state.remainingMs).toBe(10000)
  })

  it('adds one point and resets the full ten seconds for the next ability', async () => {
    mockImages()
    const { result } = renderHook(() => useGame(abilities))
    await beginGame(result)
    await act(async () => { await vi.advanceTimersByTimeAsync(7000) })
    const key = result.current.state.ability!.key
    await act(async () => { await result.current.answer(key) })
    expect(result.current.state.score).toBe(1)
    expect(result.current.state.phase).toBe('playing')
    expect(result.current.state.remainingMs).toBe(10000)
  })

  it('ignores repeated submissions while the next image is loading', async () => {
    const images = mockImages()
    const { result } = renderHook(() => useGame(abilities))
    await beginGame(result)
    images.pause()
    const key = result.current.state.ability!.key
    act(() => { void result.current.answer(key); void result.current.answer(key) })
    expect(result.current.state.score).toBe(1)
    expect(result.current.state.phase).toBe('loading')
  })

  it('ends immediately on a wrong answer', async () => {
    mockImages()
    const { result } = renderHook(() => useGame(abilities))
    await beginGame(result)
    act(() => { void result.current.answer(result.current.state.ability!.key === 'Q' ? 'E' : 'Q') })
    expect(result.current.state.phase).toBe('ended')
    expect(result.current.state.outcome).toBe('wrong')
    expect(result.current.state.score).toBe(0)
  })

  it('ends when ten seconds expire, including a late answer after a suspended tab', async () => {
    mockImages()
    const { result } = renderHook(() => useGame(abilities))
    await beginGame(result)
    await act(async () => { await vi.advanceTimersByTimeAsync(10000) })
    expect(result.current.state.outcome).toBe('timeout')
    act(() => result.current.restart())
    await act(async () => { await vi.advanceTimersByTimeAsync(3000) })
    vi.spyOn(performance, 'now').mockReturnValue(30000)
    act(() => { void result.current.answer(result.current.state.ability!.key) })
    expect(result.current.state.phase).toBe('ended')
    expect(result.current.state.outcome).toBe('timeout')
    expect(result.current.state.score).toBe(0)
  })

  it('checks the absolute deadline when returning to the tab', async () => {
    mockImages()
    const { result } = renderHook(() => useGame(abilities))
    await beginGame(result)
    vi.spyOn(performance, 'now').mockReturnValue(20000)
    fireEvent(document, new Event('visibilitychange'))
    expect(result.current.state.outcome).toBe('timeout')
  })

  it('shows 3, 2, 1 on retry without revealing an ability or accepting answers', async () => {
    mockImages()
    const { result } = renderHook(() => useGame(abilities))
    await beginGame(result)
    act(() => { void result.current.answer(result.current.state.ability!.key === 'Q' ? 'E' : 'Q') })
    act(() => result.current.restart())
    for (const value of [3, 2, 1]) {
      expect(result.current.state.phase).toBe('countdown')
      expect(result.current.state.countdown).toBe(value)
      expect(result.current.state.ability).toBeNull()
      act(() => { void result.current.answer('Q') })
      expect(result.current.state.score).toBe(0)
      await act(async () => { await vi.advanceTimersByTimeAsync(1000) })
    }
    expect(result.current.state.phase).toBe('playing')
    expect(result.current.state.remainingMs).toBe(10000)
  })

  it('uses every ability before repeating and avoids immediate repeats across cycles', async () => {
    mockImages()
    const { result } = renderHook(() => useGame(abilities))
    await beginGame(result)
    const seen = [result.current.state.ability!.id]
    for (let index = 0; index < abilities.length; index++) {
      await act(async () => { await result.current.answer(result.current.state.ability!.key) })
      seen.push(result.current.state.ability!.id)
    }
    expect(new Set(seen.slice(0, 3)).size).toBe(3)
    expect(seen[2]).not.toBe(seen[3])
  })

  it('saves and restores a record across mounts', async () => {
    mockImages()
    const game = renderHook(() => useGame(abilities))
    await beginGame(game.result)
    await act(async () => { await game.result.current.answer(game.result.current.state.ability!.key) })
    expect(game.result.current.state.best).toBe(1)
    game.unmount()
    const restored = renderHook(() => useGame(abilities))
    expect(restored.result.current.state.best).toBe(1)
  })

  it('keeps playing when browser storage is blocked', async () => {
    mockImages()
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Blocked') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Blocked') })
    const { result } = renderHook(() => useGame(abilities))
    await beginGame(result)
    await act(async () => { await result.current.answer(result.current.state.ability!.key) })
    expect(result.current.state.score).toBe(1)
    expect(result.current.state.phase).toBe('playing')
  })

  it('lets the player retry an image failure without losing their score', async () => {
    const images = mockImages()
    const { result } = renderHook(() => useGame(abilities))
    await beginGame(result)
    images.pause()
    act(() => { void result.current.answer(result.current.state.ability!.key) })
    await act(async () => { images.reject() })
    expect(result.current.state.phase).toBe('error')
    expect(result.current.state.score).toBe(1)
    act(() => { void result.current.retryImage() })
    await act(async () => { images.resolve() })
    expect(result.current.state.phase).toBe('playing')
    expect(result.current.state.score).toBe(1)
    expect(result.current.state.remainingMs).toBe(10000)
  })

  it('cancels pending countdowns and image loads on unmount', async () => {
    const images = mockImages()
    images.pause()
    const game = renderHook(() => useGame(abilities))
    act(() => { void game.result.current.start() })
    await act(async () => { await vi.advanceTimersByTimeAsync(3000) })
    game.unmount()
    await act(async () => { images.resolve(); await vi.advanceTimersByTimeAsync(30000) })
    expect(vi.getTimerCount()).toBe(0)
  })

  it('stops a pending retry countdown when the game unmounts', async () => {
    mockImages()
    const game = renderHook(() => useGame(abilities))
    await beginGame(game.result)
    act(() => { void game.result.current.answer(game.result.current.state.ability!.key === 'Q' ? 'E' : 'Q') })
    act(() => game.result.current.restart())
    expect(game.result.current.state.phase).toBe('countdown')
    game.unmount()
    await act(async () => { await vi.advanceTimersByTimeAsync(30000) })
    expect(vi.getTimerCount()).toBe(0)
  })

  it('offers recovery when an image never finishes loading', async () => {
    const images = mockImages()
    images.pause()
    const { result } = renderHook(() => useGame(abilities))
    act(() => { void result.current.start() })
    await act(async () => { await vi.advanceTimersByTimeAsync(3000) })
    await act(async () => { await vi.advanceTimersByTimeAsync(15000) })
    expect(result.current.state.phase).toBe('error')
    expect(result.current.state.outcome).toBeNull()
    expect(result.current.state.score).toBe(0)
    expect(result.current.state.remainingMs).toBe(10000)
    expect(vi.getTimerCount()).toBe(0)
  })
})
