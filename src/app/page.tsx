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
// - card interactions
//   - point and click
//   - keyboard
// - visuals
//   - active card
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

  function removeCardsFromState(card: PlayingCard): PlayingCard[] {
    // If coming from wastepile, it would be the last card
    const pileCard = wastepile.slice(-1)[0];
    if (pileCard && card.isEqualTo(pileCard)) {
      setWastepile((prevCards) => {
        const newCards = prevCards.slice(0, -1);

        newCards.forEach((card) => card.flip("down"));
        newCards[newCards.length - 1]?.flip("up");

        return newCards;
      });
      return [pileCard];
    }

    // If coming from foundation, it would be the last card
    const foundationCard = foundation[card.suit].slice(-1)[0];
    if (foundationCard && card.isEqualTo(foundationCard)) {
      setFoundation((prevFoundation) => ({
        ...prevFoundation,
        [card.suit]: prevFoundation[card.suit].slice(0, -1),
      }));
      return [foundationCard];
    }

    // If coming from tableau, need to search each
    // - can skip empty
    // - only need to check face up
    for (let i = 0; i < tableau.length; i++) {
      for (let j = 0; j < tableau[i].length; j++) {
        if (card.isFaceUp() && card.isEqualTo(tableau[i][j])) {
          setTableau((prevStacks) => {
            const newStacks = prevStacks.map((stack) => stack.slice());
            newStacks[i] = newStacks[i].slice(0, j);

            return newStacks;
          });

          const nextCard = tableau[i][j - 1];
          if (nextCard) {
            nextCard.flip("up");
          }

          return tableau[i].slice(j);
        }
      }
    }

    return [];
  }

  function dropCardInTableau(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();

    const cardJSON = e.dataTransfer?.getData("text/json");
    const card = PlayingCard.fromJSON(cardJSON);
    const targetStack = e.currentTarget as HTMLDivElement;

    if (card && targetStack) {
      const targetStackIndex = getStackIndexFromEl(targetStack);
      const movingCards = removeCardsFromState(card);

      if (movingCards.length) {
        setTableau((prevStacks) => {
          const newStacks = prevStacks.map((stack) => stack.slice());

          newStacks[targetStackIndex] =
            newStacks[targetStackIndex].concat(movingCards);
          return newStacks;
        });
      }
    }
  }

  function dropCardInFoundation(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();

    const cardJSON = e.dataTransfer?.getData("text/json");
    const card = PlayingCard.fromJSON(cardJSON);

    if (card) {
      setFoundation((prevFoundation) => {
        return {
          ...prevFoundation,
          [card.suit]: prevFoundation[card.suit].concat(
            removeCardsFromState(card)
          ),
        };
      });
    }
  }

  function draw() {
    if (deck.current.count()) {
      setWastepile((prevCards) => {
        const cards = Array.from(wastepile).concat(deck.current.draw(3));
        cards.forEach((card) => card.flip("down"));
        cards[cards.length - 1].flip("up");
        return cards;
      });
    } else {
      const cards = Array.from(wastepile);
      cards.forEach((card) => card.flip("down"));
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
      stacks[i][stackSize - 1].flip("up");
    }

    setTableau(stacks);
  }, []);

  return (
    <main className={classes.main}>
      <Stack
        onDrop={dropCardInFoundation}
        canStack={rules.canStackOnAce}
        cards={foundation[CardSuit.Hearts]}
        direction="none"
        gridArea="suit1"
      />
      <Stack
        onDrop={dropCardInFoundation}
        canStack={rules.canStackOnAce}
        cards={foundation[CardSuit.Clubs]}
        direction="none"
        gridArea="suit2"
      />
      <Stack
        onDrop={dropCardInFoundation}
        canStack={rules.canStackOnAce}
        cards={foundation[CardSuit.Diamonds]}
        direction="none"
        gridArea="suit3"
      />
      <Stack
        onDrop={dropCardInFoundation}
        canStack={rules.canStackOnAce}
        cards={foundation[CardSuit.Spades]}
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
        cards={wastepile.slice(-3)}
        direction="row"
        gridArea="draw"
      />
    </main>
  );
}

function getStackIndexFromEl(el?: HTMLElement) {
  if (!el) return -1;
  return Number(el.style.gridArea.replace("col", "")) - 1;
}
