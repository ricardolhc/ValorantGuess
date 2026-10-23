export interface AgentData {
    uuid: string
    displayName: string
    isPlayableCharacter: boolean
    abilities?: ({
        slot: string
        displayName: string
        displayIcon: string | null
    } | null)[] | null
}

export interface AgentsResponse {
    status: number
    data: (AgentData | null)[]
}
