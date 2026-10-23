export interface ImageData {
    slot : string,
    displayIcon : string,
    displayName : string
}

export type AbilityKey = 'Q' | 'E' | 'C' | 'X'

export interface PlayableAbility extends ImageData {
    id: string
    key: AbilityKey
    agentName: string
}
