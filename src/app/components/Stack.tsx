import { type PropsWithChildren, type DragEvent, useId } from "react";
import { CardSuit, CardValue, PlayingCard } from "../../utils/PlayingCards";
import classes from "./Stack.module.css";
import Card from "./Card";

type StackProps = {
  cards: PlayingCard[];
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  canStack: (card: PlayingCard, topCard?: PlayingCard) => boolean;
  direction: "row" | "column" | "none";
  background?: CardSuit;
  gridArea?: string;
  autoFoundation?: (arg0: PlayingCard) => void;
};

export default function Stack(props: PropsWithChildren<StackProps>) {
  const id = useId();
  const { direction = "column" } = props;
  const background =
    props.background !== undefined && props.background in CardSuit
      ? CardSuit[props.background].toLowerCase()
      : "placeholder";

  function dragOver(e: DragEvent<HTMLDivElement>) {
    const value = getValueFromDragEvent(e);
    const suit = getSuitFromDragEvent(e);

    if (value && suit) {
      const draggedCard = new PlayingCard(value, suit, true);
      const topCard = props.cards[props.cards.length - 1];

      if (props.canStack(draggedCard, topCard)) {
        e.preventDefault();
      }
    }
  }

  return (
    <div
      id={id}
      className={[classes[direction], classes[background]].join(" ")}
      onDragOver={dragOver}
      onDrop={props.onDrop}
      style={{ gridArea: props.gridArea }}
    >
      {props.cards.map((card) => (
        <Card
          key={card.name}
          card={card}
          autoFoundation={props.autoFoundation}
        />
      ))}
    </div>
  );
}

function getValueFromDragEvent(e: DragEvent<HTMLDivElement>): CardValue | null {
  const value = e.dataTransfer.types
    .find((type) => type.startsWith("value/"))
    ?.split("/")[1];

  if (value) {
    return parseInt(value, 10);
  }

  return null;
}

function getSuitFromDragEvent(e: DragEvent<HTMLDivElement>): CardSuit | null {
  const suit = e.dataTransfer.types
    .find((type) => type.startsWith("suit/"))
    ?.split("/")[1];

  if (suit) {
    return parseInt(suit, 10);
  }

  return null;
}
