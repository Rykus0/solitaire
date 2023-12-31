"use client";

import { type DragEvent, useEffect, useReducer } from "react";
import { reducer, initialState, ActionType } from "../state/reducer";
import { PlayingCard, CardSuit } from "../utils/PlayingCards";
import Stack from "./components/Stack";
import * as rules from "../utils/rules";

import classes from "./page.module.css";

const STACK_COUNT = 7;

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function newGame() {
    dispatch({ type: ActionType.newGame });
  }

  function dropCardInTableau(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();

    const cardJSON = e.dataTransfer?.getData("text/json");
    const card = PlayingCard.fromJSON(cardJSON);
    const targetStack = e.currentTarget as HTMLDivElement;

    if (card && targetStack) {
      dispatch({
        type: ActionType.moveCard,
        payload: {
          card,
          to: "tableau",
          index: getStackIndexFromEl(targetStack),
        },
      });
    }
  }

  function dropCardInFoundation(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();

    const cardJSON = e.dataTransfer?.getData("text/json");
    const card = PlayingCard.fromJSON(cardJSON);

    if (card) {
      dispatch({
        type: ActionType.moveCard,
        payload: { card, to: "foundation", index: card.suit },
      });
    }
  }

  function autoFoundation(card: PlayingCard) {
    const foundationTop = state.foundation[card.suit].slice(-1)[0];

    if (rules.canStackOnAce(card, foundationTop)) {
      dispatch({
        type: ActionType.moveCard,
        payload: { card, to: "foundation", index: card.suit },
      });
    }
  }

  function draw() {
    dispatch({
      type: ActionType.draw,
    });
  }

  function undo() {
    dispatch({
      type: ActionType.undo,
    });
  }

  useEffect(() => {
    newGame();
  }, []);

  return (
    <main className={classes.main}>
      {Object.values(state.foundation).reduce(
        (total, cards) => total + cards.length,
        0
      ) === 52 && <div className={classes.win}>You win!</div>}

      <button onClick={newGame} style={{ gridArea: "new" }}>
        New Game
      </button>

      <Stack
        onDrop={dropCardInFoundation}
        canStack={rules.canStackOnAce}
        cards={state.foundation[CardSuit.Hearts]}
        background={CardSuit.Hearts}
        direction="none"
        gridArea="suit1"
      />
      <Stack
        onDrop={dropCardInFoundation}
        canStack={rules.canStackOnAce}
        cards={state.foundation[CardSuit.Clubs]}
        background={CardSuit.Clubs}
        direction="none"
        gridArea="suit2"
      />
      <Stack
        onDrop={dropCardInFoundation}
        canStack={rules.canStackOnAce}
        cards={state.foundation[CardSuit.Diamonds]}
        background={CardSuit.Diamonds}
        direction="none"
        gridArea="suit3"
      />
      <Stack
        onDrop={dropCardInFoundation}
        canStack={rules.canStackOnAce}
        cards={state.foundation[CardSuit.Spades]}
        background={CardSuit.Spades}
        direction="none"
        gridArea="suit4"
      />

      {state.tableau.map((stack, index) => (
        <Stack
          key={`stack-${index}`}
          cards={stack}
          onDrop={dropCardInTableau}
          canStack={rules.canStack}
          direction="column"
          gridArea={`col${index + 1}`}
          index={index}
          autoFoundation={autoFoundation}
        />
      ))}

      <button onClick={draw} style={{ gridArea: "deck" }}>
        draw
      </button>
      <Stack
        onDrop={() => null}
        canStack={() => false}
        cards={state.wastepile.slice(-3)}
        direction="row"
        gridArea="draw"
        autoFoundation={autoFoundation}
      />
      <button onClick={undo} style={{ gridArea: "undo" }}>
        ↶ Undo
      </button>
    </main>
  );
}

function getStackIndexFromEl(el?: HTMLElement) {
  const index = el?.getAttribute("data-index") ?? "0";

  return parseInt(index, 10);
}
