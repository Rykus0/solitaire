import { type DragEvent, useId } from "react";
import classes from "./Card.module.css";

type CardProps = {
  value?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
  suit?: "spades" | "hearts" | "clubs" | "diamonds";
  dragging?: boolean;
  onDragStart?: (e: DragEvent<HTMLDivElement>) => void;
};

export default function Card(props: CardProps) {
  const id = useId();

  return (
    <div
      id={id}
      className={classes.card}
      draggable="true"
      onDragStart={props.onDragStart}
    >
      {props.value}
    </div>
  );
}
