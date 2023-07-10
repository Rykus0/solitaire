import { type PropsWithChildren, type DragEvent, useId } from "react";
import { PlayingCard } from "../../utils/PlayingCards";
import classes from "./Stack.module.css";
import Card from "./Card";

// TODO: add direction and spread (boolean) props

type StackProps = {
  cards?: PlayingCard[];
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  canStack: (card: PlayingCard, topCard?: PlayingCard) => boolean;
};

export default function Stack(props: PropsWithChildren<StackProps>) {
  const id = useId();

  function dragOver(e: DragEvent<HTMLDivElement>) {
    const cardJSON = e.dataTransfer?.getData("text/json");
    const card = PlayingCard.fromJSON(cardJSON);
    const topCard = props.cards && props.cards[props.cards.length - 1];

    if (card && props.canStack(card, topCard)) {
      e.preventDefault();
    }
  }

  return (
    <div
      id={id}
      className={classes.stack}
      onDragOver={dragOver}
      onDrop={props.onDrop}
    >
      {props.cards?.map((card) => (
        <Card key={card.getCardName()} card={card} />
      ))}
    </div>
  );
}
