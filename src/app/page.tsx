"use client";

import { type DragEvent, useEffect, useRef, useState } from "react";
import { PlayingCard as PlayingCard, Deck } from "../utils/PlayingCards";
import Card from "./components/Card";

import classes from "./page.module.css";

const STACK_COUNT = 7;

export default function Home() {
  const deck = useRef<Deck>(new Deck());
  const [stacks, setStacks] = useState<PlayingCard[][]>(new Array(STACK_COUNT));

  // TODO: alternately use click to pick up and drop card(s)
  // TODO: use menu-style keyboard controls to navigate cards
  // TODO: use enter to pick up and drop focused card and following siblings

  function dragCardStart(e: DragEvent<HTMLDivElement>) {
    const target = e.target as HTMLDivElement;
    e.dataTransfer.clearData();
    e.dataTransfer.setData("text/plain", target.id);
    // TODO: also grag all cards below this one (following siblings)
  }

  function dragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    // TODO: only allow alternating suit and descending value
  }

  function dropCard(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();

    // TODO: BUG - after card moved, currentTarget == old parent
    // TODO: flip top card of old stack if face down

    const id = e.dataTransfer?.getData("text");
    const target = e.currentTarget as HTMLDivElement;

    if (id && target) {
      const card = document.getElementById(id);

      if (card) {
        target.appendChild(card);
      }
    }
  }

  useEffect(() => {
    deck.current = new Deck();
    deck.current.shuffle();
    const stacks = new Array(STACK_COUNT);

    // TODO: start all face down except top card

    for (let i = 0; i < STACK_COUNT; i++) {
      const stackSize = i + 1;
      stacks[i] = deck.current.draw(stackSize);
    }

    setStacks(stacks);
  }, []);

  return (
    <main className={classes.main}>
      <div className={classes.board}>
        <div className={classes.stack}></div>
        <div className={classes.stack}></div>
        <div className={classes.stack}></div>
        <div className={classes.stack}></div>
      </div>
      <div className={classes.board}>
        {stacks.map((stack, index) => (
          <div
            key={`stack-${index}`}
            className={classes.stack}
            onDragOver={dragOver}
            onDrop={dropCard}
          >
            {stack.map((card) => (
              <Card
                key={card.getCardName()}
                card={card}
                onDragStart={dragCardStart}
              />
            ))}
          </div>
        ))}
      </div>
      <div className={classes.board}>
        <div className={classes.stack}></div>
        <div className={classes.stack}></div>
      </div>
    </main>
  );
}
