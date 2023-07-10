import {
  PlayingCard,
  CardSuit,
  CardValue,
  Deck,
} from "../src/utils/PlayingCards";

describe("CardValue", () => {
  it("should start with Ace == 1", () => {
    expect(CardValue.Ace).toBe(1);
  });
});

describe("Card", () => {
  it("should have a suit and value", () => {
    const myCard = new PlayingCard(CardValue.Ace, CardSuit.Hearts);

    expect(myCard.value).toBe(CardValue.Ace);
    expect(myCard.suit).toBe(CardSuit.Hearts);
  });

  it("can be compared to other cards", () => {
    const ace = new PlayingCard(CardValue.Ace, CardSuit.Hearts);
    const jack = new PlayingCard(CardValue.Jack, CardSuit.Hearts);
    const ace2 = new PlayingCard(CardValue.Ace, CardSuit.Hearts, true);

    expect(ace.isEqualTo(ace2)).toBe(true);
    expect(ace.isEqualTo(jack)).toBe(false);
  });

  it("should display face cards and aces by the first letter", () => {
    const ace = new PlayingCard(CardValue.Ace, CardSuit.Hearts);
    const jack = new PlayingCard(CardValue.Jack, CardSuit.Hearts);
    const queen = new PlayingCard(CardValue.Queen, CardSuit.Hearts);
    const king = new PlayingCard(CardValue.King, CardSuit.Hearts);

    expect(ace.displayValue).toBe("A");
    expect(jack.displayValue).toBe("J");
    expect(queen.displayValue).toBe("Q");
    expect(king.displayValue).toBe("K");
  });

  it("should display number cards by number", () => {
    const two = new PlayingCard(CardValue.Two, CardSuit.Hearts);
    const ten = new PlayingCard(CardValue.Ten, CardSuit.Hearts);

    expect(two.displayValue).toBe("2");
    expect(ten.displayValue).toBe("10");
  });

  it("should return formal card names", () => {
    const ace = new PlayingCard(CardValue.Ace, CardSuit.Hearts);
    const ten = new PlayingCard(CardValue.Ten, CardSuit.Clubs);

    expect(ace.name).toBe("Ace of Hearts");
    expect(ten.name).toBe("Ten of Clubs");
  });

  it("should return the color of the card", () => {
    const spade = new PlayingCard(CardValue.Ace, CardSuit.Spades);
    const club = new PlayingCard(CardValue.Ten, CardSuit.Clubs);
    const heart = new PlayingCard(CardValue.Queen, CardSuit.Hearts);
    const diamond = new PlayingCard(CardValue.King, CardSuit.Diamonds);

    expect(spade.color).toBe("black");
    expect(club.color).toBe("black");
    expect(heart.color).toBe("red");
    expect(diamond.color).toBe("red");
  });

  it("can be flipped face up", () => {
    const card = new PlayingCard(CardValue.Ace, CardSuit.Spades);
    expect(card.faceUp).toBe(false);
    card.flip("up");
    expect(card.faceUp).toBe(true);
    card.flip("up");
    expect(card.faceUp).toBe(true);
  });

  it("can be flipped face down", () => {
    const card = new PlayingCard(CardValue.Ace, CardSuit.Spades, true);
    expect(card.faceUp).toBe(true);
    card.flip("down");
    expect(card.faceUp).toBe(false);
    card.flip("down");
    expect(card.faceUp).toBe(false);
  });

  it("can be flipped to the opposite face", () => {
    const card = new PlayingCard(CardValue.Ace, CardSuit.Spades);
    expect(card.faceUp).toBe(false);
    card.flip();
    expect(card.faceUp).toBe(true);
    card.flip();
    expect(card.faceUp).toBe(false);
  });

  it("can be instantiated from JSON", () => {
    const card = new PlayingCard(CardValue.Ace, CardSuit.Spades);
    const json = JSON.stringify(card);
    const fromJSON = PlayingCard.fromJSON(json);

    expect(fromJSON.isEqualTo(card)).toBe(true);
  });
});

describe("Deck", () => {
  it("should be initialized with a full deck of 52 playing cards", () => {
    const myDeck = new Deck();
    expect(myDeck.count()).toBe(52);
  });

  it("can be initialized from an array of cards", () => {
    const cards = [
      new PlayingCard(CardValue.Ace, CardSuit.Hearts),
      new PlayingCard(CardValue.Ace, CardSuit.Clubs),
      new PlayingCard(CardValue.Ace, CardSuit.Diamonds),
      new PlayingCard(CardValue.Ace, CardSuit.Spades),
    ];
    const myDeck = new Deck(cards);
    expect(myDeck.count()).toBe(4);
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

    expect(myCard.suit).toBe(CardSuit.Hearts);
    expect(myCard.value).toBe(CardValue.Ace);
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
