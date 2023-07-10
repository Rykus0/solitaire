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

  function dragStart(e: DragEvent<HTMLDivElement>) {
    e.dataTransfer.clearData();
    e.dataTransfer.setData("text/json", JSON.stringify(props.card));
  }

  return (
    <div
      id={id}
      className={className}
      draggable={faceUp ? "true" : "false"}
      onDragStart={faceUp ? dragStart : undefined}
      aria-label={faceUp ? props.card.getCardName() : "Face down card"}
    >
      {faceUp && props.card.getDisplayValue()}
    </div>
  );
}
