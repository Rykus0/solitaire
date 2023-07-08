"use client";

import { type DragEvent, useEffect, useRef, useState } from "react";
import { Card as PlayingCard, Deck } from "../utils/PlayingCards";
import Card from "./components/Card";

import classes from "./page.module.css";

const STACK_COUNT = 7;

export default function Home() {
  const deck = useRef<Deck>(new Deck());
  const [stacks, setStacks] = useState<PlayingCard[][]>(new Array(STACK_COUNT));

  function dragCardStart(e: DragEvent<HTMLDivElement>) {
    const target = e.target as HTMLDivElement;
    e.dataTransfer.clearData();
    e.dataTransfer.setData("text/plain", target.id);
  }

  function dragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function dropCard(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();

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
    deck.current.shuffle();
    const stacks = new Array(STACK_COUNT);

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
