import shuffle from "./shuffle";

export class Card {
  private value: CardValue = CardValue.Ace;
  private suit: CardSuit = CardSuit.Hearts;

  constructor(value: CardValue, suit: CardSuit) {
    this.value = value;
    this.suit = suit;
  }

  getValue(): CardValue {
    return this.value;
  }

  getSuit(): CardSuit {
    return this.suit;
  }

  getCardName(): string {
    return `${CardValue[this.value]} of ${CardSuit[this.suit]}`;
  }

  getDisplayValue(): string {
    if (this.value > 10 || this.value === 1) {
      return `${CardValue[this.value]}`.charAt(0);
    }

    return `${this.value}`;
  }
}

export enum CardSuit {
  Hearts,
  Clubs,
  Diamonds,
  Spades,
}

export enum CardValue {
  Ace = 1,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Jack,
  Queen,
  King,
}

export class Deck {
  private cards: Card[] = [];

  constructor() {
    Object.values(CardSuit)
      .filter((v) => !isNaN(Number(v)))
      .forEach((suit) => {
        Object.values(CardValue)
          .filter((v) => !isNaN(Number(v)))
          .forEach((value) => {
            this.cards.push(new Card(value as CardValue, suit as CardSuit));
          });
      });
  }

  shuffle() {
    this.cards = shuffle(this.cards);
  }

  deal(count: number = 1) {
    return this.cards.splice(0, count);
  }

  count() {
    return this.cards.length;
  }
}
