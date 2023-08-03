import {
  PlayingCard,
  CardSuit,
  newDeck,
  shuffleDeck,
} from "../utils/PlayingCards";

type State = {
  deck: PlayingCard[];
  wastepile: PlayingCard[];
  tableau: PlayingCard[][];
  foundation: Record<CardSuit, PlayingCard[]>;
};

export enum ActionType {
  newGame = "NEW_GAME",
  moveCard = "MOVE_CARD",
  draw = "DRAW",
  undo = "UNDO",
}

type Action =
  | {
      type: ActionType.newGame;
    }
  | {
      type: ActionType.moveCard;
      payload: {
        card: PlayingCard;
        to: "tableau" | "foundation";
        index: number | CardSuit;
      };
    }
  | {
      type: ActionType.draw;
    }
  | {
      type: ActionType.undo;
    };

type GameState = "playing" | "won" | "stuck";

const STACK_COUNT = 7;
let history: State[] = [];

export const initialState: State = {
  deck: newDeck(),
  wastepile: [],
  tableau: new Array(STACK_COUNT),
  foundation: {
    [CardSuit.Hearts]: [],
    [CardSuit.Clubs]: [],
    [CardSuit.Diamonds]: [],
    [CardSuit.Spades]: [],
  },
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case ActionType.newGame:
      let deck = newDeck();
      const tableau = new Array(STACK_COUNT);

      history = [];
      deck = shuffleDeck(deck);

      for (let i = 0; i < STACK_COUNT; i++) {
        const stackSize = i + 1;
        tableau[i] = deck.splice(0, stackSize);
        tableau[i][stackSize - 1].flip("up");
      }

      const newGameState = {
        ...initialState,
        deck,
        tableau,
      };

      history.push(newGameState);

      return newGameState;

    // ----------------------------

    case ActionType.moveCard:
      const { to, card, index } = action.payload;
      const cardSource = getCardLocation(state, card);
      const cardsToMove = getCardsFromLocation(state, cardSource);

      const removed = {
        ...state,
        // Problem - these can be the same - 2 separate updates
        [cardSource.location]: removeCardsFromLocation(state, cardSource),
      };

      const removedAndAdded = {
        ...removed,
        [to]: addCardsToLocation(
          removed,
          {
            location: to,
            stackIndex: index,
            cardIndex: 0,
          },
          cardsToMove
        ),
      };

      history.push(removedAndAdded);

      return removedAndAdded;

    // ----------------------------

    case ActionType.draw:
      let drawnCards: PlayingCard[] = Array.from(state.wastepile);
      let deckAfterDraw = [...state.deck];

      if (state.deck.length) {
        drawnCards = drawnCards.concat(deckAfterDraw.splice(0, 3));
        drawnCards.forEach((card) => card.flip("down"));
        drawnCards[drawnCards.length - 1].flip("up");
      } else if (drawnCards.length) {
        drawnCards.forEach((card) => card.flip("down"));
        deckAfterDraw = [...drawnCards];
        drawnCards = [];
      }

      const drawState = {
        ...state,
        deck: deckAfterDraw,
        wastepile: drawnCards,
      };

      history.push(drawState);

      return drawState;

    // ----------------------------

    case ActionType.undo:
      if (history.length > 1) {
        history.pop();
      }

      return history[history.length - 1];

    // ----------------------------

    default:
      return state;
  }
}

type CardLocation =
  | {
      location: "wastepile";
      stackIndex: number;
      cardIndex: number;
    }
  | {
      location: "tableau";
      stackIndex: number;
      cardIndex: number;
    }
  | {
      location: "foundation";
      stackIndex: keyof State["foundation"];
      cardIndex: number;
    };

function getCardLocation(state: State, card: PlayingCard): CardLocation {
  const pileCard = state.wastepile.slice(-1)[0];
  if (pileCard && card.isEqualTo(pileCard)) {
    return {
      location: "wastepile",
      stackIndex: 0,
      cardIndex: state.wastepile.length - 1,
    };
  }

  const foundationCard = state.foundation[card.suit].slice(-1)[0];
  if (foundationCard && card.isEqualTo(foundationCard)) {
    return {
      location: "foundation",
      stackIndex: card.suit,
      cardIndex: state.foundation[card.suit].length - 1,
    };
  }

  for (let i = 0; i < state.tableau.length; i++) {
    for (let j = state.tableau[i].length; --j >= 0; ) {
      if (card.isFaceUp() && card.isEqualTo(state.tableau[i][j])) {
        return { location: "tableau", stackIndex: i, cardIndex: j };
      }
    }
  }

  throw new Error("Card not found");
}

function getCardsFromLocation(
  state: State,
  cardLocation: CardLocation
): PlayingCard[] {
  if (cardLocation.location === "wastepile") {
    return state.wastepile.slice(cardLocation.cardIndex);
  } else if (cardLocation.location === "foundation") {
    return state.foundation[cardLocation.stackIndex].slice(
      cardLocation.cardIndex
    );
  } else if (cardLocation.location === "tableau") {
    return state.tableau[cardLocation.stackIndex].slice(cardLocation.cardIndex);
  }

  return [];
}

function addCardsToLocation(
  state: State,
  cardLocation: CardLocation,
  cards: PlayingCard[]
): PlayingCard[][] | typeof state.foundation {
  if (cardLocation.location === "tableau") {
    const newTableau = state.tableau.map(function (arr) {
      return arr.slice();
    });

    newTableau[cardLocation.stackIndex] =
      newTableau[cardLocation.stackIndex].concat(cards);

    return newTableau;
  } else if (cardLocation.location === "foundation") {
    return {
      ...state.foundation,
      [cardLocation.stackIndex]:
        state.foundation[cardLocation.stackIndex].concat(cards),
    };
  }

  return [];
}

function removeCardsFromLocation(state: State, cardLocation: CardLocation) {
  if (cardLocation.location === "wastepile") {
    const cards = state.wastepile.slice(0, cardLocation.cardIndex);
    const lastIndex = cards.length - 1;

    if (lastIndex >= 0) {
      cards[lastIndex].flip("up");
    }

    return cards;
  } else if (cardLocation.location === "foundation") {
    const cards = state.foundation[cardLocation.stackIndex].slice(
      0,
      cardLocation.cardIndex
    );

    const lastIndex = cards.length - 1;
    if (lastIndex >= 0) {
      cards[lastIndex].flip("up");
    }

    return {
      ...state.foundation,
      [cardLocation.stackIndex]: cards,
    };
  } else if (cardLocation.location === "tableau") {
    const newTableau = state.tableau.map(function (arr) {
      return arr.slice();
    });

    newTableau[cardLocation.stackIndex].splice(cardLocation.cardIndex);

    const lastIndex = newTableau[cardLocation.stackIndex].length - 1;
    if (lastIndex >= 0) {
      newTableau[cardLocation.stackIndex][lastIndex].flip("up");
    }

    return newTableau;
  }

  return [];
}
