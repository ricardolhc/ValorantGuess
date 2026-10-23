import type { PlayableAbility } from '../interface/ImageData'

export function shuffledAbilities(abilities: PlayableAbility[], previousId?: string) {
  const deck = [...abilities]
  for (let index = deck.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1))
    const ability = deck[index]
    deck[index] = deck[other]
    deck[other] = ability
  }
  if (deck.length > 1 && deck[0].id === previousId) {
    const ability = deck[0]
    deck[0] = deck[1]
    deck[1] = ability
  }
  return deck
}
