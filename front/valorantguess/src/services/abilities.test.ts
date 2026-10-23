import { afterEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { fetchAbilities } from './abilities'

afterEach(() => { vi.restoreAllMocks() })

const ability = (slot: string, displayIcon: string | null = `${slot}.png`) => ({
  slot, displayName: slot, displayIcon,
})

describe('fetchAbilities', () => {
  it('maps abilities from several agents to Q, E, C and X', async () => {
    const get = vi.spyOn(axios, 'get').mockResolvedValue({ data: { status: 200, data: [
      { uuid: 'jett', displayName: 'Jett', isPlayableCharacter: true, abilities: [ability('Ability1'), ability('Ability2')] },
      { uuid: 'sage', displayName: 'Sage', isPlayableCharacter: true, abilities: [ability('Grenade'), ability('Ultimate')] },
    ] } })
    const controller = new AbortController()
    const result = await fetchAbilities(controller.signal)
    expect(result.map(item => [item.agentName, item.key])).toEqual([
      ['Jett', 'Q'], ['Jett', 'E'], ['Sage', 'C'], ['Sage', 'X'],
    ])
    expect(new Set(result.map(item => item.id)).size).toBe(4)
    expect(get).toHaveBeenCalledWith('https://valorant-api.com/v1/agents', { signal: controller.signal })
  })

  it('ignores missing lists, null entries, passives, missing icons and nonplayable agents', async () => {
    vi.spyOn(axios, 'get').mockResolvedValue({ data: { status: 200, data: [
      null, { abilities: null }, {},
      { uuid: 'duplicate', isPlayableCharacter: false, abilities: [ability('Ultimate')] },
      { uuid: 'unmarked', abilities: [ability('Ultimate')] },
      { uuid: 'jett', displayName: 'Jett', isPlayableCharacter: true, abilities: [
        null, ability('Passive'), ability('Unknown'), ability('Ability2', null),
        ability('Grenade', '  '), ability('Ability1', 'valid.png'),
      ] },
    ] } })
    expect(await fetchAbilities()).toEqual([{
      id: 'jett:Ability1', key: 'Q', slot: 'Ability1',
      displayName: 'Ability1', displayIcon: 'valid.png', agentName: 'Jett',
    }])
  })

  it.each([
    { status: 200, data: [] },
    { status: 200, data: [{ abilities: [ability('Passive')] }] },
    { status: 500, data: [] },
    { status: 200, data: null },
  ])('rejects an empty or invalid catalogue: %j', async data => {
    vi.spyOn(axios, 'get').mockResolvedValue({ data })
    await expect(fetchAbilities()).rejects.toThrow()
  })

  it('propagates network failures to React Query', async () => {
    vi.spyOn(axios, 'get').mockRejectedValue(new Error('Network error'))
    await expect(fetchAbilities()).rejects.toThrow('Network error')
  })
})
