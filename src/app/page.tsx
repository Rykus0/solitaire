"use client";

import { type DragEvent, useEffect, useRef, useState } from "react";
import { PlayingCard, Deck } from "../utils/PlayingCards";
import Stack from "./components/Stack";
import * as rules from "../utils/rules";

import classes from "./page.module.css";

const STACK_COUNT = 7;

// Features:
// - undo
// - new game
// - timer?
// - Move counter
// - ace stacks
// - deck stacks
// - card interactions
//   - point and click
//   - keyboard
// - visuals
//   - active card
//   - card backs
//   - card lift state
//   - drag cards
//   - placeholder card to show drop target

// TODO: use grid for layout

export default function Home() {
  const deck = useRef<Deck>(new Deck());
  const [drawnCards, setDrawnCards] = useState<PlayingCard[]>([]);
  const [stacks, setStacks] = useState<PlayingCard[][]>(new Array(STACK_COUNT));

  // TODO: alternately use click to pick up and drop card(s)
  // TODO: use menu-style keyboard controls to navigate cards
  // TODO: use enter to pick up and drop focused card and following siblings

  function dragOver(e: DragEvent<HTMLDivElement>) {
    const cardData = e.dataTransfer?.getData("text");
    const card = JSON.parse(cardData) as PlayingCard;

    const targetStack = e.currentTarget as HTMLDivElement;
    const topCard = getCardFromEl(targetStack.lastChild as HTMLElement);

    if (card && rules.canStack(card, topCard)) {
      e.preventDefault();
    }
  }

  function dropCard(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();

    const id = e.dataTransfer?.getData("text");
    const targetStack = e.currentTarget as HTMLDivElement;
    const cardEl = document.getElementById(id) as HTMLElement;

    if (cardEl && targetStack) {
      const parentStack = cardEl.parentElement;
      const card = getCardFromEl(cardEl);

      if (card && parentStack) {
        const stackIndex = getStackIndexFromEl(targetStack);
        const parentStackIndex = getStackIndexFromEl(parentStack);
        const cardIndex = Array.from(parentStack.children).indexOf(cardEl);

        setStacks((prevStacks) => {
          const newStacks = prevStacks.map((stack) => stack.slice());
          const movedCards = newStacks[parentStackIndex].splice(cardIndex);

          if (newStacks[parentStackIndex].length) {
            newStacks[parentStackIndex][
              newStacks[parentStackIndex].length - 1
            ].flip();
          }

          newStacks[stackIndex] = newStacks[stackIndex].concat(movedCards);
          return newStacks;
        });
      }
    }
  }

  function draw() {
    if (deck.current.count()) {
      setDrawnCards((prevCards) => {
        const cards = deck.current.draw(3);
        cards.forEach((card) => card.flip());
        return prevCards.concat(cards);
      });
    } else {
      const cards = Array.from(drawnCards);
      cards.forEach((card) => card.flip());
      deck.current = new Deck(cards);
      setDrawnCards([]);
    }
  }

  function placeholder() {}

  useEffect(() => {
    deck.current = new Deck();
    deck.current.shuffle();
    const stacks = new Array(STACK_COUNT);

    for (let i = 0; i < STACK_COUNT; i++) {
      const stackSize = i + 1;
      stacks[i] = deck.current.draw(stackSize);
      stacks[i][stackSize - 1].flip();
    }

    setStacks(stacks);
  }, []);

  return (
    <main className={classes.main}>
      <div className={classes.board}></div>
      <div className={classes.board}>
        {stacks.map((stack, index) => (
          <Stack
            key={`stack-${index}`}
            cards={stack}
            onDrop={dropCard}
            canStack={rules.canStack}
          />
        ))}
      </div>
      <div className={classes.board} style={{ width: "25%" }}>
        <button onClick={draw}>draw</button>
        <Stack
          onDrop={placeholder}
          canStack={() => false}
          cards={drawnCards.slice(drawnCards.length - 3)}
        />
      </div>
    </main>
  );
}

function getCardFromEl(el?: HTMLElement) {
  if (!el) return undefined;
  const cardValue = Number(el.getAttribute("data-value"));
  const cardSuit = Number(el.getAttribute("data-suit"));
  return new PlayingCard(cardValue, cardSuit);
}

function getStackIndexFromEl(el?: HTMLElement) {
  if (!el || !el.parentElement) return -1;
  return Array.from(el.parentElement.children).indexOf(el);
}
