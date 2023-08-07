import { type DragEvent, type MouseEvent, useId } from "react";
import { PlayingCard, CardSuit } from "../../utils/PlayingCards";
import classes from "./Card.module.css";

type CardProps = {
  card: PlayingCard;
  dragging?: boolean;
  onDragStart?: (e: DragEvent<HTMLDivElement>) => void;
  autoFoundation?: (arg0: PlayingCard) => void;
};

export default function Card(props: CardProps) {
  const id = useId();
  const faceUp = props.card.faceUp;
  const suit = props.card.suit;
  const className = faceUp
    ? classes[CardSuit[suit].toLowerCase()]
    : classes.back;

  function dragStart(e: DragEvent<HTMLDivElement>) {
    e.dataTransfer.clearData();
    e.dataTransfer.setData("text/json", JSON.stringify(props.card));
  }

  function onDoubleClick(e: MouseEvent<HTMLDivElement>) {
    props.autoFoundation?.(props.card);
  }

  return (
    <div
      id={id}
      className={className}
      draggable={faceUp ? "true" : "false"}
      onDragStart={faceUp ? dragStart : undefined}
      onDoubleClick={onDoubleClick}
      aria-label={faceUp ? props.card.name : "Face down card"}
    >
      {faceUp && props.card.displayValue}
    </div>
  );
}
