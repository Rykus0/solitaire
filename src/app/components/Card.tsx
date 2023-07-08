import { type DragEvent, useId } from "react";
import { PlayingCard as PlayingCard, CardSuit } from "../../utils/PlayingCards";
import classes from "./Card.module.css";

type CardProps = {
  card: PlayingCard;
  dragging?: boolean;
  onDragStart?: (e: DragEvent<HTMLDivElement>) => void;
  // TODO: face up or down
  //   - aria label only if face up
  //   - draggable only if face up
};

// TODO: scale proportinately to container based on width

export default function Card(props: CardProps) {
  const id = useId();

  return (
    <div
      id={id}
      className={classes[CardSuit[props.card.getSuit()].toLowerCase()]}
      draggable="true"
      onDragStart={props.onDragStart}
      data-suit={props.card.getSuit()}
      data-value={props.card.getValue()}
    >
      {props.card.getDisplayValue()}
    </div>
  );
}
