import shuffle from "./shuffle";

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

type CardColor = "black" | "red";

export class PlayingCard {
  private value: CardValue = CardValue.Ace;
  private suit: CardSuit = CardSuit.Hearts;
  private faceUp: boolean = false;

  constructor(value: CardValue, suit: CardSuit, faceUp: boolean = false) {
    this.value = value;
    this.suit = suit;
    this.faceUp = faceUp;
  }

  static fromJSON(json: string): PlayingCard {
    const values = JSON.parse(json);
    return new PlayingCard(values.value, values.suit, values.faceUp);
  }

  getValue(): CardValue {
    return this.value;
  }

  getSuit(): CardSuit {
    return this.suit;
  }

  getFaceUp(): boolean {
    return this.faceUp;
  }

  getColor(): CardColor {
    if (this.suit === CardSuit.Hearts || this.suit === CardSuit.Diamonds) {
      return "red";
    }

    return "black";
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

  isEqualTo(card: PlayingCard): boolean {
    return this.value === card.getValue() && this.suit === card.getSuit();
  }

  flip() {
    this.faceUp = !this.faceUp;
  }
}

export class Deck {
  private cards: PlayingCard[] = [];

  constructor(cards: PlayingCard[] = []) {
    if (cards.length) {
      this.cards = cards;
    } else {
      Object.values(CardSuit)
        .filter((v) => !isNaN(Number(v)))
        .forEach((suit) => {
          Object.values(CardValue)
            .filter((v) => !isNaN(Number(v)))
            .forEach((value) => {
              this.cards.push(
                new PlayingCard(value as CardValue, suit as CardSuit)
              );
            });
        });
    }
  }

  shuffle() {
    this.cards = shuffle(this.cards);
  }

  deal(count: number = 1) {
    return this.cards.splice(0, count);
  }

  draw = this.deal;

  count() {
    return this.cards.length;
  }
}
