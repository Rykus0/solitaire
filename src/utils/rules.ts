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
