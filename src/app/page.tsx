"use client";

import { type DragEvent, useEffect, useRef, useState } from "react";
import { PlayingCard, Deck, CardSuit } from "../utils/PlayingCards";
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

export default function Home() {
  const deck = useRef<Deck>(new Deck());
  const [wastepile, setWastepile] = useState<PlayingCard[]>([]);
  const [tableau, setTableau] = useState<PlayingCard[][]>(
    new Array(STACK_COUNT)
  );
  const [foundation, setFoundation] = useState<Record<CardSuit, PlayingCard[]>>(
    {
      [CardSuit.Hearts]: [],
      [CardSuit.Clubs]: [],
      [CardSuit.Diamonds]: [],
      [CardSuit.Spades]: [],
    }
  );

  // TODO: alternately use click to pick up and drop card(s)
  // TODO: use menu-style keyboard controls to navigate cards
  // TODO: use enter to pick up and drop focused card and following siblings

  function dropCardInTableau(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();

    const cardJSON = e.dataTransfer?.getData("text/json");
    const card = PlayingCard.fromJSON(cardJSON);
    const targetStack = e.currentTarget as HTMLDivElement;

    if (card && targetStack) {
      const parentStack = cardEl.parentElement;

      if (card && parentStack) {
        const stackIndex = getStackIndexFromEl(targetStack);
        const parentStackIndex = getStackIndexFromEl(parentStack);
        const cardIndex = Array.from(parentStack.children).indexOf(cardEl);

        setTableau((prevStacks) => {
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
      setWastepile((prevCards) => {
        const cards = deck.current.draw(3);
        cards[cards.length - 1].flip();
        return prevCards.concat(cards);
      });
    } else {
      const cards = Array.from(wastepile);
      cards.forEach((card) => card.flip());
      deck.current = new Deck(cards);
      setWastepile([]);
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

    setTableau(stacks);
  }, []);

  return (
    <main className={classes.main}>
      <Stack
        onDrop={placeholder}
        canStack={rules.canStackOnAce}
        cards={[]}
        direction="none"
        gridArea="suit1"
      />
      <Stack
        onDrop={placeholder}
        canStack={rules.canStackOnAce}
        cards={[]}
        direction="none"
        gridArea="suit2"
      />
      <Stack
        onDrop={placeholder}
        canStack={rules.canStackOnAce}
        cards={[]}
        direction="none"
        gridArea="suit3"
      />
      <Stack
        onDrop={placeholder}
        canStack={rules.canStackOnAce}
        cards={[]}
        direction="none"
        gridArea="suit4"
      />

      {tableau.map((stack, index) => (
        <Stack
          key={`stack-${index}`}
          cards={stack}
          onDrop={dropCardInTableau}
          canStack={rules.canStack}
          direction="column"
          gridArea={`col${index + 1}`}
        />
      ))}

      <button onClick={draw} style={{ gridArea: "deck" }}>
        draw
      </button>
      <Stack
        onDrop={placeholder}
        canStack={() => false}
        cards={wastepile.slice(wastepile.length - 3)}
        direction="row"
        gridArea="draw"
      />
    </main>
  );
}

function getStackIndexFromEl(el?: HTMLElement) {
  if (!el || !el.parentElement) return -1;
  return Array.from(el.parentElement.children).indexOf(el);
}
