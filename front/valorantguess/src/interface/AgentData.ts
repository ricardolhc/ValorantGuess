export interface AgentData {
    status : string,
    data : {
        uuid : string,
        displayName : string,
        abilities : [
            {
                displayIcon : string
            }
        ]
    }
}