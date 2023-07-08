import { type DragEvent, useId } from "react";
import { Card as PlayingCard, CardSuit } from "../../utils/PlayingCards";
import classes from "./Card.module.css";

type CardProps = {
  card: PlayingCard;
  dragging?: boolean;
  onDragStart?: (e: DragEvent<HTMLDivElement>) => void;
};

export default function Card(props: CardProps) {
  const id = useId();

  return (
    <div
      id={id}
      className={classes[CardSuit[props.card.getSuit()].toLowerCase()]}
      draggable="true"
      onDragStart={props.onDragStart}
    >
      {props.card.getDisplayValue()}
    </div>
  );
}
