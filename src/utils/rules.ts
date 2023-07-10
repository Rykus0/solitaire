import { PlayingCard, CardValue } from "./PlayingCards";

export function canStack(card: PlayingCard, targetCard?: PlayingCard) {
  if (targetCard) {
    return (
      card.getValue() === targetCard.getValue() - 1 &&
      card.getColor() !== targetCard.getColor()
    );
  }

  return card.getValue() === CardValue.King;
}

export function canStackOnAce(card: PlayingCard, targetCard?: PlayingCard) {
  if (targetCard) {
    return (
      card.getValue() === targetCard.getValue() + 1 &&
      card.getSuit() === targetCard.getSuit()
    );
  }

  return card.getValue() === CardValue.Ace;
}
