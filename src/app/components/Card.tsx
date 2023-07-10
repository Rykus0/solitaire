import { type DragEvent, useId } from "react";
import { PlayingCard as PlayingCard, CardSuit } from "../../utils/PlayingCards";
import classes from "./Card.module.css";

type CardProps = {
  card: PlayingCard;
  dragging?: boolean;
  onDragStart?: (e: DragEvent<HTMLDivElement>) => void;
};

export default function Card(props: CardProps) {
  const id = useId();
  const faceUp = props.card.getFaceUp();
  const suit = props.card.getSuit();
  const className = faceUp
    ? classes[CardSuit[suit].toLowerCase()]
    : classes.back;

  return (
    <div
      id={id}
      className={className}
      draggable={faceUp ? "true" : "false"}
      onDragStart={faceUp ? props.onDragStart : undefined}
      data-suit={suit}
      data-value={props.card.getValue()}
      aria-label={faceUp ? props.card.getCardName() : "Face down card"}
    >
      {faceUp && props.card.getDisplayValue()}
    </div>
  );
}
