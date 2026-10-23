// @vitest-environment jsdom
import { StrictMode } from 'react'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import App from './App'
import { abilities } from './test/fixtures'
import { mockImages } from './test/images'

const clients: QueryClient[] = []
function renderGame(strict = false) {
  const client = new QueryClient({ defaultOptions: { queries: { cacheTime: 0 } }, logger: { log: console.log, warn: console.warn, error: () => {} } })
  clients.push(client)
  const app = <QueryClientProvider client={client}><App /></QueryClientProvider>
  return render(strict ? <StrictMode>{app}</StrictMode> : app)
}

beforeEach(() => {
  localStorage.clear()
  mockImages()
  vi.spyOn(Math, 'random').mockReturnValue(0.999)
  vi.spyOn(axios, 'get').mockResolvedValue({ data: { status: 200, data: abilities.map(ability => ({
    uuid: ability.id.split(':')[0], displayName: ability.agentName, isPlayableCharacter: true,
    abilities: [{ slot: ability.slot, displayName: ability.displayName, displayIcon: ability.displayIcon }],
  })) } })
})
afterEach(() => {
  cleanup()
  clients.forEach(client => client.clear())
  clients.length = 0
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

async function start(strict = false) {
  renderGame(strict)
  await waitFor(() => expect((screen.getByRole('button', { name: /iniciar desafio/i }) as HTMLButtonElement).disabled).toBe(false))
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'performance'], shouldClearNativeTimers: true })
  fireEvent.click(screen.getByRole('button', { name: /iniciar desafio/i }))
  for (const count of ['3', '2', '1']) {
    expect(screen.getByLabelText('Contagem para começar').textContent).toBe(count)
    expect(screen.queryByRole('img', { name: 'Ícone da habilidade a identificar' })).toBeNull()
    expect((screen.getByRole('button', { name: 'Responder Q' }) as HTMLButtonElement).disabled).toBe(true)
    await act(async () => { await vi.advanceTimersByTimeAsync(1000) })
  }
  expect(screen.getByRole('img', { name: 'Ícone da habilidade a identificar' })).toBeTruthy()
}

describe('Valorant Guess', () => {
  it('shows no ability or answer before the player starts', async () => {
    renderGame()
    await waitFor(() => expect((screen.getByRole('button', { name: /iniciar desafio/i }) as HTMLButtonElement).disabled).toBe(false))
    expect(screen.queryByRole('img', { name: 'Ícone da habilidade a identificar' })).toBeNull()
    expect(screen.queryByText(/Updraft|Jett|Ability1/)).toBeNull()
    expect((screen.getByRole('button', { name: 'Responder Q' }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('plays through a correct answer and then reveals the answer on defeat', async () => {
    await start()
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Responder Q' })) })
    expect(screen.getByRole('img', { name: 'Ícone da habilidade a identificar' }).getAttribute('src')).toBe(abilities[1].displayIcon)
    expect(screen.getByLabelText('Sua sequência').textContent).toContain('01')
    fireEvent.click(screen.getByRole('button', { name: 'Responder Q' }))
    const result = screen.getByRole('region', { name: 'Resultado da partida' })
    expect(within(result).getByText('Healing Orb')).toBeTruthy()
    expect(within(result).getByText('Sage')).toBeTruthy()
    expect(within(result).getByText('E')).toBeTruthy()
    expect(axios.get).toHaveBeenCalledTimes(1)
  })

  it('accepts keyboard answers but ignores held keys and modifier shortcuts', async () => {
    await start()
    fireEvent.keyDown(document, { key: 'q', repeat: true })
    fireEvent.keyDown(document, { key: 'q', ctrlKey: true })
    expect(screen.getByLabelText('Sua sequência').textContent).toContain('00')
    await act(async () => { fireEvent.keyDown(document, { key: 'q' }) })
    expect(screen.getByLabelText('Sua sequência').textContent).toContain('01')
  })

  it('renders the three-second retry countdown with no visible ability', async () => {
    await start()
    fireEvent.click(screen.getByRole('button', { name: 'Responder E' }))
    fireEvent.click(screen.getByRole('button', { name: /tentar novamente/i }))
    for (const value of ['3', '2', '1']) {
      expect(screen.getByLabelText('Contagem para começar').textContent).toBe(value)
      expect(screen.queryByRole('img', { name: 'Ícone da habilidade a identificar' })).toBeNull()
      await act(async () => { await vi.advanceTimersByTimeAsync(1000) })
    }
    expect(screen.getByRole('img', { name: 'Ícone da habilidade a identificar' })).toBeTruthy()
    expect(screen.getByRole('timer').textContent).toBe('10')
  })

  it('offers retry when the API is unavailable and recovers after a successful response', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Offline'))
    renderGame()
    expect(await screen.findByRole('alert', {}, { timeout: 3000 })).toBeTruthy()
    expect(screen.queryByRole('img', { name: 'Ícone da habilidade a identificar' })).toBeNull()
    vi.mocked(axios.get).mockResolvedValue({ data: { status: 200, data: [{
      uuid: 'jett', displayName: 'Jett', isPlayableCharacter: true, abilities: [{ slot: 'Ability1', displayName: 'Updraft', displayIcon: abilities[0].displayIcon }],
    }] } })
    fireEvent.click(screen.getByRole('button', { name: /tentar carregar novamente/i }))
    await waitFor(() => expect((screen.getByRole('button', { name: /iniciar desafio/i }) as HTMLButtonElement).disabled).toBe(false))
  })

  it('can start normally under React StrictMode', async () => {
    await start(true)
    expect(screen.getByRole('timer').textContent).toBe('10')
  })
})
