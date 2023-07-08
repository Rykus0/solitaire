import { Card, CardSuit, CardValue, Deck } from "../src/utils/PlayingCards";

describe("CardValue", () => {
  it("should start with Ace == 1", () => {
    expect(CardValue.Ace).toBe(1);
  });
});

describe("Card", () => {
  it("should have a suit and value", () => {
    const myCard = new Card(CardValue.Ace, CardSuit.Hearts);

    expect(myCard.getValue()).toBe(CardValue.Ace);
    expect(myCard.getSuit()).toBe(CardSuit.Hearts);
  });
});

describe("Deck", () => {
  it("should be initialized with a full deck of 52 playing cards", () => {
    const myDeck = new Deck();
    expect(myDeck.count()).toBe(52);
  });

  it("should contain a full set of unique playing cards", () => {
    const myDeck = new Deck();
    const cardSet = new Set();

    while (myDeck.count() > 0) {
      const card = myDeck.deal()[0];
      cardSet.add(JSON.stringify(card));
    }

    expect(cardSet.size).toBe(52);
  });

  it("should deal the top card by default", () => {
    const myDeck = new Deck();
    const myCard = myDeck.deal()[0];

    expect(myCard.getSuit()).toBe(CardSuit.Hearts);
    expect(myCard.getValue()).toBe(CardValue.Ace);
  });

  it("should remove the card from the deck once dealt", () => {
    const myDeck = new Deck();
    myDeck.deal();

    expect(myDeck.count()).toBe(51);
  });

  it("should allow an arbitrary number of cards per deal", () => {
    const myDeck = new Deck();
    const hand = myDeck.deal(7);

    expect(myDeck.count()).toBe(45);
    expect(hand.length).toBe(7);
  });

  it("should return an empty array when dealing from an empty deck", () => {
    const myDeck = new Deck();
    myDeck.deal(52);

    expect(myDeck.deal().length).toBe(0);
  });
});