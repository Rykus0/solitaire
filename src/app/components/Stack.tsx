import { type PropsWithChildren, type DragEvent, useId } from "react";
import { PlayingCard } from "../../utils/PlayingCards";
import classes from "./Stack.module.css";
import Card from "./Card";

type StackProps = {
  cards: PlayingCard[];
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  canStack: (card: PlayingCard, topCard?: PlayingCard) => boolean;
  direction: "row" | "column" | "none";
  gridArea?: string;
};

export default function Stack(props: PropsWithChildren<StackProps>) {
  const id = useId();
  const { direction = "column" } = props;

  function dragOver(e: DragEvent<HTMLDivElement>) {
    const cardJSON = e.dataTransfer?.getData("text/json");
    const draggedCard = PlayingCard.fromJSON(cardJSON);
    const topCard = props.cards[props.cards.length - 1];

    if (draggedCard && props.canStack(draggedCard, topCard)) {
      e.preventDefault();
    }
  }

  return (
    <div
      id={id}
      className={classes[direction]}
      onDragOver={dragOver}
      onDrop={props.onDrop}
      style={{ gridArea: props.gridArea }}
    >
      {props.cards.map((card) => (
        <Card key={card.name} card={card} />
      ))}
    </div>
  );
}
