import { PlayingCard, CardValue } from "./PlayingCards";

export function canStack(card: PlayingCard, targetCard?: PlayingCard) {
  if (targetCard) {
    return (
      card.value === targetCard.value - 1 && card.color !== targetCard.color
    );
  }

  return card.value === CardValue.King;
}

export function canStackOnAce(card: PlayingCard, targetCard?: PlayingCard) {
  if (targetCard) {
    return card.value === targetCard.value + 1 && card.suit === targetCard.suit;
  }

  return card.value === CardValue.Ace;
}
