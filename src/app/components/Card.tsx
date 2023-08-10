import { type DragEvent, type MouseEvent, useId, useState } from "react";
import { PlayingCard, CardSuit } from "../../utils/PlayingCards";
import classes from "./Card.module.css";

type CardProps = {
  card: PlayingCard;
  dragging?: boolean;
  onDragStart?: (e: DragEvent<HTMLDivElement>) => void;
  autoFoundation?: (arg0: PlayingCard) => void;
};

export default function Card(props: CardProps) {
  const [zIndex, setZIndex] = useState(0);
  const id = useId();
  const faceUp = props.card.faceUp;
  const suit = props.card.suit;
  const className = faceUp
    ? classes[CardSuit[suit].toLowerCase()]
    : classes.back;

  function dragStart(e: DragEvent<HTMLDivElement>) {
    e.dataTransfer.clearData();
    e.dataTransfer.setData("text/json", JSON.stringify(props.card));
    e.dataTransfer.setData(`suit/${suit}`, "");
    e.dataTransfer.setData(`value/${props.card.value}`, "");
    e.dataTransfer.dropEffect = "move";
  }

  function onDoubleClick(e: MouseEvent<HTMLDivElement>) {
    props.autoFoundation?.(props.card);
  }

  function onMouseDown() {
    setZIndex(1000);
  }

  function onMouseUp() {
    setZIndex(0);
  }

  return (
    <div
      id={id}
      className={className}
      draggable={faceUp ? "true" : "false"}
      onDragStart={faceUp ? dragStart : undefined}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      aria-label={faceUp ? props.card.name : "Face down card"}
      style={{
        zIndex,
      }}
    >
      {faceUp && props.card.displayValue}
    </div>
  );
}
