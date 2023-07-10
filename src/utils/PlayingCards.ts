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
  private _value: CardValue = CardValue.Ace;
  private _suit: CardSuit = CardSuit.Hearts;
  private _faceUp: boolean = false;

  constructor(value: CardValue, suit: CardSuit, faceUp: boolean = false) {
    this._value = value;
    this._suit = suit;
    this._faceUp = faceUp;
  }

  static fromJSON(json: string): PlayingCard {
    const values = JSON.parse(json);
    return new PlayingCard(values._value, values._suit, values._faceUp);
  }

  get value(): CardValue {
    return this._value;
  }

  get suit(): CardSuit {
    return this._suit;
  }

  get faceUp(): boolean {
    return this._faceUp;
  }

  get color(): CardColor {
    if (this._suit === CardSuit.Hearts || this._suit === CardSuit.Diamonds) {
      return "red";
    }

    return "black";
  }

  get name(): string {
    return `${CardValue[this._value]} of ${CardSuit[this._suit]}`;
  }

  get displayValue(): string {
    if (this._value > 10 || this._value === 1) {
      return `${CardValue[this._value]}`.charAt(0);
    }

    return `${this._value}`;
  }

  isEqualTo(card: PlayingCard): boolean {
    return this._value === card.value && this._suit === card.suit;
  }

  isFaceUp(): boolean {
    return this._faceUp;
  }

  flip(direction?: "up" | "down") {
    if (direction === "up") {
      this._faceUp = true;
    } else if (direction === "down") {
      this._faceUp = false;
    } else {
      this._faceUp = !this._faceUp;
    }
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
