"use client";

import { type DragEvent, useEffect, useReducer } from "react";
import { reducer, initialState, ActionType } from "../state/reducer";
import { PlayingCard, CardSuit } from "../utils/PlayingCards";
import Stack from "./components/Stack";
import * as rules from "../utils/rules";

import classes from "./page.module.css";

const STACK_COUNT = 7;

// Features:
// - undo
// - new game
// - timer?
// - win condition
// - Move counter
// - card interactions
//   - point and click
//   - keyboard
// - visuals
//   - active card
//   - card lift state
//   - drag cards
//   - placeholder card to show drop target

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // TODO: alternately use click to pick up and drop card(s)
  // TODO: use menu-style keyboard controls to navigate cards
  // TODO: use enter to pick up and drop focused card and following siblings

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

      <button onClick={newGame}>New Game</button>

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
  if (!el) return -1;
  return Number(el.style.gridArea.replace("col", "")) - 1;
}
