import axios from 'axios'
import type { AgentsResponse } from '../interface/AgentData'
import type { AbilityKey, PlayableAbility } from '../interface/ImageData'

const keys: Record<string, AbilityKey | undefined> = {
    Ability1: 'Q', Ability2: 'E', Grenade: 'C', Ultimate: 'X',
}

export async function fetchAbilities(signal?: AbortSignal): Promise<PlayableAbility[]> {
    const { data } = await axios.get<AgentsResponse>(
        'https://valorant-api.com/v1/agents',
        { signal },
    )

    if (!data || data.status !== 200 || !Array.isArray(data.data)) {
        throw new Error('Não foi possível carregar os agentes.')
    }

    const abilities = data.data.flatMap(agent => {
        if (!agent || agent.isPlayableCharacter !== true || !Array.isArray(agent.abilities)) return []
        return agent.abilities.flatMap(ability => {
            const key = ability && keys[ability.slot]
            if (!ability || !key || typeof ability.displayIcon !== 'string' || !ability.displayIcon.trim()) return []
            return [{
                id: `${agent.uuid}:${ability.slot}`,
                key,
                slot: ability.slot,
                displayName: ability.displayName,
                displayIcon: ability.displayIcon.trim(),
                agentName: agent.displayName,
            }]
        })
    })

    if (abilities.length === 0) {
        throw new Error('Nenhuma habilidade com imagem foi encontrada.')
    }

    return [...new Map(abilities.map(ability => [ability.id, ability])).values()]
}
